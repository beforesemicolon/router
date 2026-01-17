import type { WebComponent } from '@beforesemicolon/web-component'

export type RoutingMode = 'history' | 'hash'

export type PathChangeListener = (
    pathname: string,
    query: Record<string, string>,
    data: Record<string, unknown>
) => void

export type RouteGuard = (
    pathname: string,
    query: Record<string, unknown>,
    data: Record<string, unknown>
) => boolean | Promise<boolean> | string | Promise<string>

export interface RouteMeta {
    title?: string
    requiresAuth?: boolean
    breadcrumb?: string
    [key: string]: unknown
}

export interface RouteOptions {
    exact?: boolean
    meta?: RouteMeta
}

export interface PageRouteProps {
    path: string
    src: string
    component: unknown
    exact: boolean
    title: string
}

export interface PageRouteQueryProps extends PageRouteProps {
    key: string
    value: string
    src: string
}

export interface PageLinkProps {
    path: string
    search: string
    keepCurrentSearch: boolean
    exact: boolean
    title: string
    payload: Record<string, unknown>
}

export interface PageRedirectProps
    extends Omit<PageLinkProps, 'search' | 'keepCurrentSearch'> {
    type: 'unknown' | 'always'
}

export interface PageDataProps {
    key: string
    param: string
    searchParam: string
}

export enum Status {
    Idle,
    Loading,
    Loaded,
    LoadingFailed,
}

export interface PageRoute extends WebComponent<PageRouteProps> {
    path: PageRouteProps['path']
    src: PageRouteProps['src']
    component: PageRouteProps['component']
    title: PageRouteProps['title']
    exact: PageRouteProps['exact']
    fullPath: string
}

export interface PageLink extends WebComponent<PageLinkProps> {
    path: PageLinkProps['path']
    search: PageLinkProps['search']
    title: PageLinkProps['title']
    exact: PageLinkProps['exact']
    keepCurrentSearch: PageLinkProps['keepCurrentSearch']
    payload: PageLinkProps['payload']
    fullPath: string
}

export interface PageData extends WebComponent<PageDataProps> {
    key: PageDataProps['key']
    param: PageDataProps['param']
    searchParam: PageDataProps['searchParam']
}

export interface PageRouteQuery extends WebComponent<PageRouteQueryProps> {
    key: PageRouteQueryProps['key']
    value: PageRouteQueryProps['value']
    src: PageRouteQueryProps['src']
}

export interface PageRedirect extends PageLink {
    type: PageRedirectProps['type']
}
