import { DashboardLayout, HomeView, ModelsView, DatasetsView, InfraProvidersView, SettingsView, BecomePartnerView, ModelUploadView, DatasetUploadView } from '@/components/dashboard';
import { MyUploadsView, EarningsView, WithdrawView, TransactionsView, Assets } from '@/components/dashboard';
import { useParams } from 'react-router-dom';

const VIEWS = {
  all: HomeView,
  models: ModelsView,
  datasets: DatasetsView,
  assets: Assets,
  'infra-providers': InfraProvidersView,
  'upload-model': ModelUploadView,
  'upload-dataset': DatasetUploadView,
  'my-uploads': MyUploadsView,
  'earnings': EarningsView,
  'withdraw': WithdrawView,
  'transactions': TransactionsView,
  'settings': SettingsView,
  'become-partner': BecomePartnerView
};

export function DashboardContainer() {
  const { view = 'all' } = useParams();
  const View = VIEWS[view as keyof typeof VIEWS] || HomeView;

  return (
    <DashboardLayout>
      <View />
    </DashboardLayout>
  );
}