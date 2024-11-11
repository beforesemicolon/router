import type { WebComponent } from '@beforesemicolon/web-component'

export type PathChangeListener = (
    pathname: string,
    query: Record<string, string>,
    data: Record<string, unknown>
) => void

export interface PageRedirectProps {
    to: string
    type: 'unknown' | 'always'
    title: string
    payload: Record<string, unknown>
}

export interface PageRouteProps {
    path: string
    src: string
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
    title: string
    payload: Record<string, unknown>
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
    title: PageRouteProps['title']
    exact: PageRouteProps['exact']
    fullPath: string
}

export interface PageLink extends WebComponent<PageLinkProps> {
    path: PageLinkProps['path']
    search: PageLinkProps['search']
    title: PageLinkProps['title']
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

export interface PageRedirect extends WebComponent<PageRedirectProps> {
    to: PageRedirectProps['to']
}
