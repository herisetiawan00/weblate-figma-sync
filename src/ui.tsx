import { render } from '@create-figma-plugin/ui'
import { h } from 'preact'
import FormPage from './ui/form/FormPage'
import { useEffect, useState } from 'preact/hooks'
import LoadingPage from './ui/loading/LoadingPage';
import { on } from '@create-figma-plugin/utilities';
import { IReset, IWeblateSyncFinish, IWeblateSyncStart, IWeblateSyncUpdate } from './common/event';
import FinishPage from './ui/finish/FinishPage';

function Plugin() {
  const [loading, setLoading] = useState<boolean>(false);
  const [result, setResult] = useState<{ success: boolean, error?: string }>();

  useEffect(() => {
    on<IWeblateSyncStart>('W_SYNC_START', () => {
      console.log('hehehehe');
      setLoading(true);
    });
    on<IWeblateSyncFinish>('W_SYNC_FINISH', (result) => {
      setLoading(false);
      setResult(result);
    });
    on<IReset>('RESET', () => {
      setLoading(false);
      setResult(undefined);
    });
    on<IWeblateSyncUpdate>('W_SYNC_UPDATE', console.log);
  }, []);

  if (loading) {
    return <LoadingPage />
  }

  if (result) {
    return <FinishPage {...result} />
  }

  return <FormPage onSubmit={() => setLoading(true)}/>
}

export default render(Plugin)
