#!/usr/bin/env bash
# Wire rockymountainhomesales.com through k3s Traefik → http://HOST:3002
# Requires: kubectl (k3s), rocky-mountain-homes-next systemd service on 3002
set -eu

REPO="/var/www/rocky-mountain-homes-next"
HOST_IP="$(hostname -I | awk '{print $1}')"

if [ -z "${HOST_IP}" ]; then
  echo "Could not determine host IP for Endpoints"
  exit 1
fi

echo "==> Host IP for Traefik backend: ${HOST_IP}"

if ! systemctl is-active rocky-mountain-homes-next >/dev/null 2>&1; then
  echo "rocky-mountain-homes-next is not active. Start it first:"
  echo "  sudo systemctl start rocky-mountain-homes-next"
  exit 1
fi

if ! curl -sf -m 3 "http://127.0.0.1:3002/" >/dev/null; then
  echo "App not reachable at http://127.0.0.1:3002"
  exit 1
fi

if ! curl -sf -m 3 "http://${HOST_IP}:3002/" >/dev/null; then
  echo "App not reachable at http://${HOST_IP}:3002 (needed for k3s Traefik Endpoints)"
  exit 1
fi

echo "==> App reachable on 127.0.0.1:3002 and ${HOST_IP}:3002"

if ! kubectl get crd ingressroutes.traefik.io >/dev/null 2>&1; then
  echo "Traefik IngressRoute CRD not found. Is k3s running?"
  exit 1
fi

echo "==> Applying IngressRoute + Service + Endpoints"
sed "s/__HOST_IP__/${HOST_IP}/g" "${REPO}/deploy/k8s/rocky-mountain-homes.yaml" \
  | kubectl apply -f -

echo "==> IngressRoute status"
kubectl get ingressroute rocky-mountain-homes -n default -o wide 2>/dev/null || true

echo "==> Test HTTPS via Traefik (local SNI)"
curl -sk -H "Host: rockymountainhomesales.com" https://127.0.0.1/ -o /dev/null -w "RMH local HTTPS status: %{http_code}\n" || true

echo "Done."
echo "If Cloudflare still shows 525, create a TLS secret from the Let's Encrypt cert (see docs/DEPLOYMENT_HTTPS_TRAEFIK.md)."
