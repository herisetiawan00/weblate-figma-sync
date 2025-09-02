import { Container, LoadingIndicator, Text } from "@create-figma-plugin/ui";
import { on } from "@create-figma-plugin/utilities";
import { h } from "preact";
import { useEffect, useState } from "preact/hooks";
import { IWeblateSyncUpdate } from "../../common/event";

const LoadingPage = () => {
  const [syncInfo, setSyncInfo] = useState<string>('');

  useEffect(() => {
    on<IWeblateSyncUpdate>('W_SYNC_UPDATE', setSyncInfo);
  }, []);

  return (
    <Container style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', height: '100%' }} space='medium' >
      <Container style={{ height: 50 }} space='small' >
        <LoadingIndicator />
      </Container>
      <Text align="center">{syncInfo}</Text>
    </Container>
  )
}

export default LoadingPage;
