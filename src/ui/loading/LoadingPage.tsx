import { Container, LoadingIndicator, Text } from "@create-figma-plugin/ui";
import { emit, on, once } from "@create-figma-plugin/utilities";
import { h } from "preact";
import { useEffect, useState } from "preact/hooks";
import { INavigationReplace, IWeblateSyncFinish, IWeblateSyncUpdate } from "../../common/event";

const LoadingPage = () => {
  const [syncInfo, setSyncInfo] = useState<string>('');

  useEffect(() => {
    on<IWeblateSyncUpdate>('W_SYNC_UPDATE', setSyncInfo);
    once<IWeblateSyncFinish>('W_SYNC_FINISH', (args) =>
      emit<INavigationReplace>('N_REPLACE', { name: '/finish', args }),
    );
  }, []);

  return (
    <Container style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', height: '100%' }} space='medium' >
      <Container style={{ height: 50 }} space='small' >
        <LoadingIndicator />
      </Container>
      <Text>{syncInfo}</Text>
    </Container>
  )
}

export default LoadingPage;
