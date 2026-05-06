import { PropsWithChildren } from 'react'

const PageWrapper = ({ children }: PropsWithChildren) => {
  return <div className="pt-10">{children}</div>
}

export default PageWrapper
