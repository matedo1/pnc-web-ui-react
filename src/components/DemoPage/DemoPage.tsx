import { useTitle } from 'hooks/useTitle';

import { PageLayout } from 'components/PageLayout/PageLayout';

export const DemoPage = () => {
  useTitle('Demo Page');

  return (
    <PageLayout title="Component Demo" description="Component demo page intended for showcasing React components.">
      Demo Page
    </PageLayout>
  );
};
