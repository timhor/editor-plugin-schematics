// simulates packages/editor/editor-core/src/ui/ContentStyles/index.tsx

import styled from 'styled-components';
import { HTMLAttributes, ComponentClass } from 'react';
import {} from '@atlaskit/editor-common';
import { existingStyles1 } from '../../plugins/existing/styles1';
import { existingStyles2 } from '../../plugins/existing/styles2';
import { existingStyles3 } from '../../plugins/existing/styles3';

const ContentStyles: ComponentClass<HTMLAttributes<{}> & {
  theme: any;
  allowAnnotation?: boolean;
}> = styled.div`
  .ProseMirror-selectednode {
    outline: none;
  }

  .ProseMirror-selectednode:empty {
    outline: 2px solid #8cf;
  }

  ${existingStyles1}
  ${existingStyles2}
  ${existingStyles3}

  .fabric-editor-align-center {
    text-align: center;
  }
`;

export default ContentStyles;
