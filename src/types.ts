import { WebComponent } from '@beforesemicolon/web-component'

export type PathChangeListener = (
    pathname: string,
    query: Record<string, string>,
    data: Record<string, unknown>
) => void

export interface PageRedirectProps {
    to: string
    type: 'unknown' | 'always'
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
    default: boolean
}

export interface PageLinkProps {
    path: string
    search: string
    default: boolean
    keepCurrentSearch: boolean
    title: string
    data: Record<string, unknown>
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
    default: PageLinkProps['default']
    keepCurrentSearch: PageLinkProps['keepCurrentSearch']
    data: PageLinkProps['data']
    fullPath: string
}

export interface PageRouteQuery extends WebComponent<PageRouteQueryProps> {
    key: PageRouteQueryProps['key']
    value: PageRouteQueryProps['value']
    src: PageRouteQueryProps['src']
    default: PageRouteQueryProps['default']
}

export interface PageRedirect extends WebComponent<PageRedirectProps> {
    to: PageRedirectProps['to']
}
