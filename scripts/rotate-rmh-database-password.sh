#!/usr/bin/env bash
# Rotate rmh_user MySQL password and sync rocky-mountain-homes-next/.env.local
# Requires: sudo access to local MySQL (debian-sys-maint / root socket)
# Usage: sudo bash scripts/rotate-rmh-database-password.sh

set -euo pipefail

ROOT="$(cd "$(dirname "$0")/.." && pwd)"
ENV_FILE="${ROOT}/.env.local"

if [[ ! -f "${ENV_FILE}" ]]; then
  echo "Missing ${ENV_FILE}" >&2
  exit 1
fi

# MySQL MEDIUM policy: mixed case, digit, special; validate_password.check_user_name=ON (no "rmh")
gen_password() {
  local hex
  hex="$(openssl rand -hex 16)"
  # Prefix/suffix avoid username substring "rmh"
  printf 'K9#%s!Zx2Q' "${hex}"
}

NEW_PW="$(gen_password)"

echo "Updating MySQL user rmh_user (all hosts)..."
HOSTS="$(mysql -N -e "SELECT host FROM mysql.user WHERE user = 'rmh_user'")"
if [[ -z "${HOSTS}" ]]; then
  echo "No rmh_user accounts found in mysql.user" >&2
  exit 1
fi

while IFS= read -r host; do
  [[ -z "${host}" ]] && continue
  printf -v SQL "ALTER USER 'rmh_user'@'%s' IDENTIFIED BY '%s';" "${host}" "${NEW_PW}"
  mysql -e "${SQL}"
  echo "  updated rmh_user@${host}"
done <<< "${HOSTS}"

mysql -e "FLUSH PRIVILEGES;"

PW_FILE="$(mktemp)"
chmod 600 "${PW_FILE}"
printf '%s' "${NEW_PW}" > "${PW_FILE}"

export ENV_FILE PW_FILE
python3 <<'PY'
from pathlib import Path
import os
import re

env_path = Path(os.environ["ENV_FILE"])
password = Path(os.environ["PW_FILE"]).read_text()
quoted = '"' + password.replace("\\", "\\\\").replace('"', '\\"') + '"'
text = env_path.read_text()
if re.search(r"^DATABASE_PASSWORD=.*$", text, re.M):
    text = re.sub(
        r"^DATABASE_PASSWORD=.*$",
        f"DATABASE_PASSWORD={quoted}",
        text,
        count=1,
        flags=re.M,
    )
else:
    text = text.rstrip() + f"\nDATABASE_PASSWORD={quoted}\n"
env_path.write_text(text)
PY

rm -f "${PW_FILE}"

echo "Updated ${ENV_FILE}"
echo "Verifying connection..."
mysql -h 127.0.0.1 -u rmh_user -p"${NEW_PW}" -e "SELECT 1 AS ok;" rocky_mtn_homes >/dev/null
echo "Done. Restart the app: sudo systemctl restart rocky-mountain-homes-next"
