type SafeEmailTextProps = {
  address: string
  className?: string
}

export function SafeEmailText({ address, className = '' }: SafeEmailTextProps) {
  const [user, ...domainParts] = address.split('@')
  const domain = domainParts.join('@')

  if (!user || !domain) {
    return <span className={className}>{address}</span>
  }

  return (
    <span className={className}>
      <span>{user}</span>
      <span>@</span>
      <span>{domain}</span>
    </span>
  )
}
