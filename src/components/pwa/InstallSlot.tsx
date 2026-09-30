/** Empty until an eligible visitor reaches this point. PwaManager owns the
 * single offer, dismissal state and platform-specific installation flow. */
export default function InstallSlot({ placement }: { placement: string }) {
  return <div data-pwa-install-slot={placement} className="min-h-px" />;
}
