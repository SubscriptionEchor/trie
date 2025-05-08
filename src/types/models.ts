// In @/types/models.ts
export interface Model {
  metadata?: {
    name: string;
    type: string
  },
  nft_value?: string;
  id: string;
  type: string;
  pricing?: {
    model: string;
    price: string;
    currency: string;
  };
  name: string;
  description: string;
  longDescription?: string;
  creator: {
    name: string;
    avatar: string;
    bio?: string;
  };
  usage?: object;
  categories?: string[];
  updatedAt?: string | Date;
  likes?: string | number;
  image?: string;
  serviceName?: string;
  metrics?: Record<string, string | number>;
  downloads?: string | number;
  epoch?: number | undefined;
  tags?: string[];
  views?: string | number;
  stars?: string | number;
  lastUpdated?: string;
  license?: string;
}

// export interface Dataset extends Model {
//   format: string;
//   size: string;
//   license: string;
//   metadata?: {
//     rows: string;
//     columns: string;
//     schema: string;
//   };
// }

export interface InfraProvider extends Model {
  region: string;
  specs: {
    cpu: string;
    memory: string;
    storage: string;
    gpu: string;
  };
  terms?: {
    usage: string[];
    custom?: string;
  };
}