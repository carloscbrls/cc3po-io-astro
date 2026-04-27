#!/bin/bash
# PHI Scanner — Scans codebase for HIPAA/PHI compliance issues
# Usage: ./scripts/phi-scanner.sh [directory]

set -euo pipefail

DIR="${1:-.}"

echo "=== CC3PO PHI Scanner ==="
echo "Scanning: $DIR"
echo ""

CRITICAL=0
HIGH=0
MEDIUM=0

# 1. Hardcoded secrets
echo "--- Checking for hardcoded secrets ---"
SECRETS=$(grep -rn --include="*.ts" --include="*.js" --include="*.astro" --include="*.tsx" --include="*.jsx" \
  -iE '(api_key|apikey|api_secret|secret_key|password|token|auth_token|private_key)\s*[:=]\s*["\x27][^"\x27]{8,}' \
  "$DIR" 2>/dev/null || true)

if [ -n "$SECRETS" ]; then
  echo "🔴 CRITICAL: Hardcoded secrets found:"
  echo "$SECRETS"
  CRITICAL=$((CRITICAL + 1))
else
  echo "✅ No hardcoded secrets found"
fi
echo ""

# 2. PHI patterns
echo "--- Checking for PHI patterns ---"
PHI=$(grep -rn --include="*.ts" --include="*.js" --include="*.astro" --include="*.tsx" --include="*.jsx" \
  -iE '(ssn|social.security|date.of.birth|dob|patient.id|medical.record|health.insurance|diagnosis|icd.10|cpt.code)' \
  "$DIR" 2>/dev/null || true)

if [ -n "$PHI" ]; then
  echo "🟠 HIGH: PHI-related patterns found (verify these are not actual PHI):"
  echo "$PHI"
  HIGH=$((HIGH + 1))
else
  echo "✅ No PHI patterns found"
fi
echo ""

# 3. HTTP instead of HTTPS in API calls
echo "--- Checking for insecure API calls ---"
HTTP=$(grep -rn --include="*.ts" --include="*.js" --include="*.astro" \
  -iE 'http://[^/]*(api|auth|login|submit|form|patient|health)' \
  "$DIR" 2>/dev/null || true)

if [ -n "$HTTP" ]; then
  echo "🟠 HIGH: Insecure HTTP API calls found:"
  echo "$HTTP"
  HIGH=$((HIGH + 1))
else
  echo "✅ No insecure API calls found"
fi
echo ""

# 4. Missing .env.example
echo "--- Checking .env.example ---"
if [ -f "$DIR/.env.example" ]; then
  echo "✅ .env.example exists"
else
  echo "🟡 MEDIUM: No .env.example file found"
  MEDIUM=$((MEDIUM + 1))
fi
echo ""

# 5. Sensitive files in gitignore
echo "--- Checking .gitignore coverage ---"
GITIGNORE_ENTRIES=$(cat "$DIR/.gitignore" 2>/dev/null || echo "")
for FILE in ".env" ".env.local" ".env.production" "*.pem" "*.key" "*.p12"; do
  if echo "$GITIGNORE_ENTRIES" | grep -q "$FILE"; then
    echo "  ✅ $FILE in .gitignore"
  else
    echo "  🟡 MEDIUM: $FILE not in .gitignore"
    MEDIUM=$((MEDIUM + 1))
  fi
done
echo ""

# Summary
echo "=== Summary ==="
echo "🔴 Critical: $CRITICAL"
echo "🟠 High: $HIGH"
echo "🟡 Medium: $MEDIUM"

if [ "$CRITICAL" -gt 0 ]; then
  echo ""
  echo "❌ BLOCKED: Critical issues must be fixed before merge"
  exit 1
elif [ "$HIGH" -gt 0 ]; then
  echo ""
  echo "⚠️ WARNING: High issues should be reviewed"
  exit 0
else
  echo ""
  echo "✅ No critical or high issues found"
  exit 0
fi