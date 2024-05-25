import { WebComponent } from '@beforesemicolon/web-component'

export type PathChangeListener = (
    pathname: string,
    query: Record<string, string>,
    data: Record<string, unknown>
) => void

export interface PageRedirectProps {
    to: string
}

export interface PageRouteProps {
    path: string
    src: string
    exact: boolean
    data: Record<string, unknown>
    title: string
}

export interface PageRouteQueryProps extends PageRouteProps {
    key: string
    value: string
    src: string
    default: boolean
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
    data: PageRouteProps['data']
    fullPath: string
}

export interface PageRouteQuery extends WebComponent<PageRouteQueryProps> {
    key: PageRouteQueryProps['key']
    value: PageRouteQueryProps['value']
    src: PageRouteQueryProps['src']
    default: PageRouteQueryProps['default']
    data: PageRouteQueryProps['data']
}

export interface PageRedirect extends WebComponent<PageRedirectProps> {
    to: PageRedirectProps['to']
}
