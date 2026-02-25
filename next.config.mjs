import { withPayload } from '@payloadcms/next/withPayload'

export default withPayload({
  reactStrictMode: true,
  /**
   * Next dev cross-origin protection for `/_next/*` assets.
   * Set `ALLOWED_DEV_ORIGINS` on the VPS to the origin(s) you browse from, comma-separated.
   *
   * Example:
   * - `ALLOWED_DEV_ORIGINS=http://YOUR_LAPTOP_IP:3000,http://YOUR_VPS_IP:3000`
   */
  allowedDevOrigins: (process.env.ALLOWED_DEV_ORIGINS ?? '')
    .split(',')
    .map((s) => s.trim())
    .filter(Boolean),
})
