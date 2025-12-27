import Home from './pages/Home';
import DocsOverview from './pages/DocsOverview';
import DocsQuickstart from './pages/DocsQuickstart';
import DocsWallet from './pages/DocsWallet';
import DocsRpc from './pages/DocsRpc';
import DocsExplorer from './pages/DocsExplorer';
import DocsContracts from './pages/DocsContracts';
import DocsRecipeEvents from './pages/DocsRecipeEvents';
import DocsTroubleshooting from './pages/DocsTroubleshooting';
import DocsChangelog from './pages/DocsChangelog';
import ToolsNetworkRegistry from './pages/ToolsNetworkRegistry';
import ToolsRpcHealth from './pages/ToolsRpcHealth';
import ToolsExport from './pages/ToolsExport';
import Resources from './pages/Resources';
import DocsRecipeRead from './pages/DocsRecipeRead';
import DocsRecipeSend from './pages/DocsRecipeSend';
import __Layout from './Layout.jsx';


export const PAGES = {
    "Home": Home,
    "DocsOverview": DocsOverview,
    "DocsQuickstart": DocsQuickstart,
    "DocsWallet": DocsWallet,
    "DocsRpc": DocsRpc,
    "DocsExplorer": DocsExplorer,
    "DocsContracts": DocsContracts,
    "DocsRecipeEvents": DocsRecipeEvents,
    "DocsTroubleshooting": DocsTroubleshooting,
    "DocsChangelog": DocsChangelog,
    "ToolsNetworkRegistry": ToolsNetworkRegistry,
    "ToolsRpcHealth": ToolsRpcHealth,
    "ToolsExport": ToolsExport,
    "Resources": Resources,
    "DocsRecipeRead": DocsRecipeRead,
    "DocsRecipeSend": DocsRecipeSend,
}

export const pagesConfig = {
    mainPage: "Home",
    Pages: PAGES,
    Layout: __Layout,
};