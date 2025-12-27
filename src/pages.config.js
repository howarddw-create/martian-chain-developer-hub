import Home from './pages/Home';
import DocsOverview from './pages/DocsOverview';
import DocsQuickstart from './pages/DocsQuickstart';
import DocsWallet from './pages/DocsWallet';
import __Layout from './Layout.jsx';


export const PAGES = {
    "Home": Home,
    "DocsOverview": DocsOverview,
    "DocsQuickstart": DocsQuickstart,
    "DocsWallet": DocsWallet,
}

export const pagesConfig = {
    mainPage: "Home",
    Pages: PAGES,
    Layout: __Layout,
};