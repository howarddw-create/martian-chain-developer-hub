import Home from './pages/Home';
import DocsOverview from './pages/DocsOverview';
import __Layout from './Layout.jsx';


export const PAGES = {
    "Home": Home,
    "DocsOverview": DocsOverview,
}

export const pagesConfig = {
    mainPage: "Home",
    Pages: PAGES,
    Layout: __Layout,
};