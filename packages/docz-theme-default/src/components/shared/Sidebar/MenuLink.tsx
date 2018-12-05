import * as React from 'react'
import { useEffect, useRef, useState, SFC } from 'react'
import { Link, MenuItem, useConfig } from 'docz'
import styled, { css } from 'react-emotion'

import { MenuHeadings } from './MenuHeadings'
import { get } from '@utils/theme'
import { usePrevious } from '@utils/usePrevious'

interface WrapperProps {
  active: boolean
  theme?: any
}

const activeWrapper = css`
  padding-left: 0;

  &:after {
    width: 1px;
  }
`

const Wrapper = styled('div')`
  position: relative;
  transition: padding 0.2s;

  &:after {
    position: absolute;
    display: block;
    content: '';
    top: 30px;
    left: 24px;
    width: 0;
    height: calc(100% - 36px);
    border-left: 1px dashed ${get('colors.sidebarBorder')};
    transition: width 0.2s;
  }

  ${(p: WrapperProps) => p.active && activeWrapper};
`

export const linkStyle = ({ colors }: any) => css`
  position: relative;
  display: block;
  padding: 4px 24px;
  font-weight: 600;
  font-size: 18px;
  letter-spacing: -0.02em;
  color: ${colors.sidebarText};
  text-decoration: none;
  transition: color 0.2s;

  &:hover,
  &:visited {
    color: ${colors.sidebarText};
  }

  &:hover,
  &.active {
    color: ${colors.sidebarPrimary || colors.primary};
    font-weight: 600;
  }
`

const LinkAnchor = styled('a')`
  ${p => linkStyle(p.theme.docz)};
`

export const getActiveFromClass = (el: HTMLElement | null) =>
  Boolean(el && el.classList.contains('active'))

interface LinkProps {
  item: MenuItem
  onClick?: React.MouseEventHandler<any>
  className?: string
  innerRef?: (node: any) => void
}

export const MenuLink: SFC<LinkProps> = ({
  item,
  children,
  onClick,
  innerRef,
}) => {
  const [active, setActive] = useState(false)
  const prevActive = usePrevious(active)
  const config = useConfig()
  const $el = useRef(null)

  const linkProps = {
    children,
    onClick,
    className: linkStyle(config.themeConfig),
    innerRef: (node: any) => {
      innerRef && innerRef(node)
      $el.current = node
    },
  }

  useEffect(() => {
    const isActive = getActiveFromClass($el.current)
    if (prevActive !== isActive) setActive(isActive)
  })

  return (
    <Wrapper active={active}>
      {item.route ? (
        <Link {...linkProps} to={item.route} />
      ) : (
        <LinkAnchor
          {...linkProps}
          href={item.href || '#'}
          target={item.href ? '_blank' : '_self'}
        />
      )}
      {active && item.route && <MenuHeadings route={item.route} />}
    </Wrapper>
  )
}
