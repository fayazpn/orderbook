import { OrderSide } from '@app/types/types';

type SizeHighlightType = {
  orderSide: OrderSide;
};

const DepthVisualizerColors = {
  BIDS: '#113534',
  ASKS: '#3d1e28',
};

function SizeHighlight({ orderSide }: SizeHighlightType) {
  return (
    <div
      data-testid="depth-visualizer"
      style={{
        backgroundColor: `${orderSide === 'buy' ? DepthVisualizerColors.BIDS : DepthVisualizerColors.ASKS}`,
        height: '100%',
        width: `100%`,
        position: 'absolute',
        top: 0,
        zIndex: -1,
        // border: '1px solid white',
      }}
    />
  );
}

export default SizeHighlight;
