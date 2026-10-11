import React from 'react'

type PanelProps = React.PropsWithChildren<{
  header: string
}>

const Panel = ({ header, children }: PanelProps) => (
  <div className="ais-Panel">
    <div className="ais-Panel-header">
      <span>{header}</span>
    </div>
    <div className="ais-Panel-body">{children}</div>
  </div>
)

export default Panel
