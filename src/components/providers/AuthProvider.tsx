import { ReactNode, useRef } from 'react';
import { AuthContext } from '@/contexts/auth';
import { useState, useCallback, useEffect } from 'react';
import { WalletService, WalletType } from '@/services/wallet';
// import { Modal } from '@/components/ui';
import { END_POINTS } from '@/api/requests';
import { X } from 'lucide-react';
// import { X } from 'lucide-react';

const STORAGE_KEY = 'wallet_details';

interface AuthProviderProps {
  children: ReactNode;
}

interface StoredWalletInterface {
  did: string;
  username: string;
}

export function AuthProvider({ children }: AuthProviderProps) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [showExtensionModal, setShowExtensionModal] = useState(false);
  const [connectedWallet, setConnectedWallet] = useState<{ did: string; username: string } | null>(null);
  const [nftData, setNftData] = useState<any>([])
  const [infraProviders, setInfraProviders] = useState<any>([])
  const [loader, setLoader] = useState<boolean>(false)
  let path = window?.location?.pathname


  // [
  //   {
  //     "storage": "500GB",
  //     "memory": "16GB",
  //     "os": "Ubuntu",
  //     "core": "4",
  //     "gpu": "Nividia",
  //     "processor": "Intel Xeon",
  //     "region": "N.virginia",
  //     "hostingCost": 1,
  //     "platformName": "AWS",
  //     "providerName": "AWS support team",
  //     "platformImageUri": "",
  //     "platformDescription": "aws infra providers",
  //     "providerDid": "bafybmialabl2a23voctghw2i2unny3h5flztwt2obr6t44jd2mpuna4m4m"
  //   },
  //   {
  //     "storage": "1TB",
  //     "memory": "32GB",
  //     "os": "Linux",
  //     "core": "8",
  //     "gpu": "Nividia",
  //     "processor": "Intel Xeon",
  //     "region": "California",
  //     "hostingCost": 1,
  //     "platformName": "AWS",
  //     "providerName": "AWS support team",
  //     "platformImageUri": "",
  //     "platformDescription": "aws infra providers",
  //     "providerDid": "bafybmie4d45biuv35ywa4gvmltmc5mocngsyxutjpfyw7bs4pr2cz73ir4"
  //   },
  //   {
  //     "storage": "200GB",
  //     "memory": "8GB",
  //     "os": "Windows Server",
  //     "core": "2",
  //     "gpu": "AMD",
  //     "processor": "AMD Ryzen",
  //     "region": "Singapore",
  //     "hostingCost": 1,
  //     "platformName": "Azure",
  //     "providerName": "Azure support team",
  //     "platformImageUri": "",
  //     "platformDescription": "Microsoft Azure cloud infrastructure",
  //     "providerDid": "bafybmic2iqiuslmkgo3ju6mvdoh4dl7ogl4tsjwptd7sljz6qx6m7i4oni"
  //   },
  //   {
  //     "storage": "2TB",
  //     "memory": "64GB",
  //     "os": "Ubuntu",
  //     "core": "16",
  //     "gpu": "Nividia",
  //     "processor": "Intel Xeon",
  //     "region": "Frankfurt",
  //     "hostingCost": 1,
  //     "platformName": "Google Cloud",
  //     "providerName": "Google Cloud support team",
  //     "platformImageUri": "",
  //     "platformDescription": "Google Cloud platform infrastructure",
  //     "providerDid": "bafybmifwrzh5rrwt5o7tmvpsxuxy6do6eltijkss65rjhqtzsrn6gu73bi"
  //   }
  // ]

  function groupByPlatformName(infraProviders: any[]) {
    const grouped = infraProviders.reduce((acc, provider) => {
      if (!acc[provider.platformName]) {
        // Create an entry for the platform with the name and description
        acc[provider.platformName] = {
          name: provider.platformName,
          description: provider.platformDescription,
          providers: [] // Initialize an empty array for the providers
        };
      }

      // Add the provider to the respective platform's providers list
      acc[provider.platformName].providers.push(provider);

      return acc;
    }, {} as Record<string, { name: string, description: string, providers: any[] }>);

    // Convert the grouped object into an array of grouped platform objects
    return Object.values(grouped);
  }



  const socketRef = useRef<WebSocket | null>();

  // useEffect(() => {
  //   setInfraProviders(groupedProviders)
  // }, [])


  const connectWebSocket = () => {
    const wsUrl = `wss://dev-api.xellwallet.com:8443/ws?clientID=${connectedWallet?.did}`;
    console.log(`Connecting to WebSocket at ${wsUrl}...`);

    const ws = new WebSocket(wsUrl);

    socketRef.current = ws; // Store the WebSocket instance in the ref

    ws.onopen = () => {
      console.log('WebSocket connection established!');


      // Send initial message
      const initialMessage = {
        type: 'hello',
        clientId: "client-124",
        timestamp: Date.now(),
      };
      ws.send(JSON.stringify(initialMessage));
      console.log('Sent initial message:', initialMessage);
    };


    ws.onmessage = (event) => {
      try {
        const actions = ["DEPLOY_NFT", "TRANSFER_FT", "EXECUTE_NFT"]
        const data = JSON.parse(event.data);
        console.log(data, 'Received message:');
        if (data?.type == "OPEN_EXTENSION" && actions.includes(data?.data?.action)) {
          window.myExtension.trigger({
            type: data?.data?.action,
            data: data?.data?.payload
          });
        }

        // If handling extension commands, you can add logic here:
        // if (data.type === 'extension_command') { handleExtensionCommand(data.command); }
      } catch (e) {
        console.log('Received non-JSON message:', event.data);
      }
    };

    ws.onclose = (event) => {
      console.log(`WebSocket connection closed: Code ${event.code}`);

      // Reconnect after a delay
      setTimeout(connectWebSocket, 100);
    };

    ws.onerror = (error) => {
      console.error('WebSocket error:', error);
    };
  };


  // Set up the WebSocket connection when the component mounts
  useEffect(() => {
    const connections = ["/faucet", "/faucet/"]
    if (connectedWallet && !connections.includes(path)) {
      connectWebSocket();
    }

    // Clean up on unmount
    return () => {
      if (socketRef.current) {
        socketRef.current.close();
      }
    };
  }, [connectedWallet]);

  useEffect(() => {
    // if (connectedWallet) {
    (async () => {
      try {
        const connections = ["/faucet", "/faucet/"]
        if (connections.includes(path)) {
          return
        }
        setLoader(true)
        // Fetch NFTs by DID
        const infraProvidersData = await END_POINTS.providers() as any;
        if (infraProvidersData?.length > 0) {
          setInfraProviders(groupByPlatformName(infraProvidersData))
        }
        // const getnftsbydid = await END_POINTS.get_nfts_by_did({ did: connectedWallet.did });
        const getnfts = await END_POINTS.list_nfts() as any;

        // console.log(infraProviders)

        if (getnfts?.status && getnfts?.nfts?.length > 0) {
          // Initialize array to hold NFTs with metadata

          // Use Promise.all to handle all async operations in parallel
          const nftsWithMetadata = await Promise.all(
            getnfts.nfts.map(async (item: any) => {
              try {
                // Fetch metadata for each NFT
                const res = await END_POINTS.get_meta_by_nft_id({ id: item?.nft }) as any;
                const usageHistory = await END_POINTS.get_usage_history({ nft: item?.nft }) as any
                let data = {}
                // Decode base64 metadata if it exists
                if (res?.status && res?.artifactMetadata) {
                  try {
                    const decodedString = atob(res.artifactMetadata);
                    const jsonData = JSON.parse(decodedString);

                    // Return NFT with decoded metadata
                    data = {
                      ...data,
                      ...item,
                      metadata: jsonData
                    };
                  } catch (error) {
                    console.error('Error decoding metadata:', error);
                    // Return with original metadata if decoding fails

                  }
                }
                if (usageHistory?.status && usageHistory?.NFTDataReply?.length > 0) {
                  data = {
                    ...data,
                    usageHistory: usageHistory?.NFTDataReply
                  }
                }

                // Return with metadata as is if no artifactMetadata or status is false
                return data
              } catch (error) {
                console.error('Error fetching metadata for NFT:', item?.nft, error);
              }
            })
          );
          setNftData(nftsWithMetadata?.filter((item: any) => item));
        } else {
          // Handle case where no NFTs were found
          setNftData([]);
        }
      } catch (error) {
        console.error('Error in NFT fetching process:', error);
        // Handle the error appropriately
      }
      finally {
        setLoader(false)
      }
    })();
    // }
  }, [])


  // Load stored wallet connection on mount
  useEffect(() => {
    let storedWallet: string | null = localStorage.getItem(STORAGE_KEY);
    storedWallet = storedWallet ? JSON.parse(storedWallet) : null

    if (storedWallet) {
      const parsedWallet = storedWallet as unknown as StoredWalletInterface;
      try {
        setConnectedWallet(parsedWallet);
        setIsAuthenticated(true);
      } catch (error) {
        console.error('Failed to parse stored wallet:', error);
      }
    }
  }, []);


  const connectWallet = useCallback(async (type: WalletType) => {
    const isInstalled = await WalletService.isExtensionInstalled();

    // If wallet is not installed, show installation options
    if (!isInstalled) {
      if (type === 'xell') {
        setShowExtensionModal(true);
      }
      return;
    }

    try {
      // Attempt to connect to the wallet
      const result = await WalletService.connect(type);

      if (!result) {
        // User rejected or connection failed
        return;
      }

      // setIsAuthenticated(true);
      // setConnectedWallet({ type: result.type, address: result.address });

      // Store wallet connection
      localStorage.setItem(STORAGE_KEY, JSON.stringify({
        type: result.type,
        address: result.address
      }));

    } catch (error) {
      console.error('Wallet connection failed:', error);
    }
  }, []);

  const login = useCallback(async () => {
    await connectWallet('xell');
  }, [connectWallet]);

  const logout = useCallback(async () => {
    // if (connectedWallet) {
    //   await WalletService.disconnect(connectedWallet.type);
    // }
    setIsAuthenticated(false);
    setConnectedWallet(null);

    // Clear stored wallet connection
    localStorage.removeItem(STORAGE_KEY);

  }, [connectedWallet]);
  const handleInstallExtension = () => {
    // Open Chrome Web Store for extension
    window.open('https://chrome.google.com/webstore/detail/aoiajendlccnpnbaabjipmaobbjllijb', '_blank');
    setShowExtensionModal(false)
  };

  // Handle reloading the page
  const handleReloadPage = () => {
    window.location.reload();
    setShowExtensionModal(false)
  };
  const onClose = () => {
    setShowExtensionModal(false)
  }

  return (
    <AuthContext.Provider value={{
      isAuthenticated,
      login,
      logout,
      connectWallet,
      connectedWallet,
      setConnectedWallet,
      setIsAuthenticated,
      socketRef,
      nftData,
      infraProviders,
      loader,
      setShowExtensionModal,
      showExtensionModal
    }}>
      {children}
      {showExtensionModal &&
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-gray-800 rounded-lg p-6 max-w-md w-full relative">
            <button
              onClick={onClose}
              className="absolute top-4 right-4 text-gray-400 hover:text-white"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="text-center mb-6">
              <div className="w-16 h-16 bg-yellow-500 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                </svg>
              </div>
              <h3 className="text-white text-xl font-bold font-['IBM_Plex_Sans']">
                Wallet Connection Issue
              </h3>
              <p className="text-gray-300 mt-2 font-['IBM_Plex_Sans']">
                There seems to be an issue with the XELL wallet connection. You may need to install the extension or reload the page to continue.
              </p>
            </div>

            <div className="flex flex-col space-y-3">
              <button
                onClick={handleInstallExtension}
                className="w-full py-3 bg-white text-black font-semibold rounded-lg hover:bg-gray-200 transition-colors font-['IBM_Plex_Sans']"
              >
                Install Extension
              </button>

              <button
                onClick={handleReloadPage}
                className="w-full py-3 bg-[#0284a5] text-white font-semibold rounded-lg hover:bg-[#026d8a] transition-colors font-['IBM_Plex_Sans']"
              >
                Reload Page
              </button>

              <button
                onClick={onClose}
                className="w-full py-3 bg-transparent border border-gray-600 text-white font-semibold rounded-lg hover:bg-gray-700 transition-colors font-['IBM_Plex_Sans']"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>}

    </AuthContext.Provider>
  );
}