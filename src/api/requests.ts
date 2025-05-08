
import api from "./axios";

// import { AxiosRequestConfig } from "axios";

declare module "axios" {
    export interface AxiosRequestConfig {
        serviceType?: string;
    }
}
export const END_POINTS = {

    get_nfts_by_did: (params: any) => {
        return api.get('get-nfts-by-did', {
            params,
            serviceType: "node" // Using port 4000
        });
    },
    get_meta_by_nft_id: (params: any) => {
        return api.get(`upload_asset/get_artifact_info_by_cid/${params?.id}`, {
            serviceType: 'dapp' // Using port 40001
        });
    },
    get_articfact_by_nft_id: (params: any) => {
        return api.get(`upload_asset/get_artifact_file_name/${params?.id}`, {
            serviceType: 'dapp' // Using port 4001
        });
    },
    get_usage_history: (params: any) => {
        return api.get(`get-nft-token-chain-data`, {
            params,
            serviceType: "node" // Using port 4001
        });
    },
    list_nfts: () => {
        return api.get(`list-nfts`, {
            serviceType: "node" // Using port 4001
        });
    },
    upload_files: (data: any) => {
        return api.post(`upload_asset/upload_artifacts`,
            data,
            { serviceType: "dapp" });
    },
    download_artifact: (params: any) => {

        return api.get(`download_artifact/${params?.id}`,
            {
                serviceType: "dapp"
            });
    },
    get_ft_info_by_did: (params: any) => {
        return api.get(`get-ft-info-by-did`,
            {
                params,
                serviceType: "node"
            });
    },
    request_ft: (params: any) => {
        return api.post(`increment`,
            params,
            {
                serviceType: "faucet"
            });
    },
    providers: () => {
        return api.get(`onboarded_providers`,
            {
                serviceType: "dapp"
            });
    },

}
