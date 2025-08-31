import { Container, VerticalSpace, Columns, Button, Text } from "@create-figma-plugin/ui";
import { emit } from "@create-figma-plugin/utilities";
import { h } from "preact";
import { useCallback } from "preact/hooks";
import { IClose, IReset } from "../../common/event";

const FinishPage = (args: { success: boolean, error?: string }) => {
  const handleCloseButton = useCallback(() => emit<IClose>('CLOSE'), []);
  const handleBackButton = useCallback(() => emit<IReset>('RESET'), []);

  return (
    <Container space="medium" style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', height: '100%', width: '100%' }}>
      {
        args.success
          ? <Text style={{ color: '#78C841' }}>Sync Success</Text>
          : <Text style={{ color: '#E62727' }}>Sync Failed</Text>
      }
      <VerticalSpace space="extraLarge" />
      <Columns space="extraSmall">
        {!args.success &&
          <Button fullWidth onClick={handleBackButton}>
            Back
          </Button>
        }
        <Button fullWidth onClick={handleCloseButton} secondary>
          Close
        </Button>
      </Columns>
    </Container>

  )
}

export default FinishPage;
