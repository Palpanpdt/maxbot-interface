/**
 * MaxBot Production Fix
 * Ce script corrige les problèmes de simulation et force les transactions réelles
 */

// Vérifier et forcer le mode production
const PRODUCTION_MODE = true;

// Activer le mode production dès le chargement
document.addEventListener('DOMContentLoaded', function() {
    console.log("🚀 MaxBot Production Fix - Activation des transactions réelles");
    
    // Stockage local pour garder le réglage
    localStorage.setItem('maxbot_environment', 'production');
    
    // Correctifs pour Web3
    configureWeb3ForProduction();
    
    // Correctifs pour MetaMask
    patchMetaMask();
    
    // Ajouter un indicateur de mode production
    addProductionIndicator();
});

// Configure Web3 pour la production
function configureWeb3ForProduction() {
    if (typeof window.ethereum !== 'undefined') {
        // Utiliser le provider MetaMask
        window.web3 = new Web3(window.ethereum);
        
        // Forcer l'utilisation du réseau principal Polygon
        window.ethereum.request({
            method: 'wallet_switchEthereumChain',
            params: [{ chainId: '0x89' }], // 137 en hexadécimal = Polygon Mainnet
        }).catch(console.error);
        
        console.log("✅ Web3 configuré pour la production avec MetaMask");
    } else {
        // Fallback sur un provider RPC public
        window.web3 = new Web3('https://polygon-rpc.com');
        console.log("⚠️ MetaMask non détecté, utilisation d'un provider public");
    }
}

// Patch MetaMask pour éviter les simulations
function patchMetaMask() {
    if (window.ethereum) {
        const originalRequest = window.ethereum.request;
        
        window.ethereum.request = async function(args) {
            // Pour les transactions
            if (args.method === 'eth_sendTransaction' && args.params && args.params[0]) {
                // Forcer l'adresse expéditrice
                if (!args.params[0].from && window.ethereum.selectedAddress) {
                    args.params[0].from = window.ethereum.selectedAddress;
                }
                
                // Supprimer les attributs de simulation
                delete args.params[0].simulation;
                delete args.params[0].test;
                delete args.params[0].dry_run;
                
                console.log("🔄 Transaction modifiée pour mode production:", args.params[0]);
            }
            
            return originalRequest.call(window.ethereum, args);
        };
        
        console.log("✅ MetaMask patché pour éviter les simulations");
    }
}

// Ajouter un indicateur visuel de mode production
function addProductionIndicator() {
    const indicator = document.createElement('div');
    indicator.style.position = 'fixed';
    indicator.style.top = '10px';
    indicator.style.right = '10px';
    indicator.style.backgroundColor = 'green';
    indicator.style.color = 'white';
    indicator.style.padding = '5px 10px';
    indicator.style.borderRadius = '5px';
    indicator.style.zIndex = '9999';
    indicator.style.fontSize = '12px';
    indicator.style.fontWeight = 'bold';
    indicator.textContent = '🔴 PRODUCTION';
    
    document.body.appendChild(indicator);
}
