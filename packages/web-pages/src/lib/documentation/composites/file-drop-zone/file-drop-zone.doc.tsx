import * as React from 'react';
import { FileDropzone } from '@inithium/ui';
import { CompositeDocView } from '../components/composite-doc-view.js';
import type { CompositeDoc } from '../composite-doc.types.js';

const FileDropzoneDemo = () => {
  const [file, setFile] = React.useState<File | null>(null);

  return (
    <div className="w-full max-w-sm">
      <FileDropzone value={file} onChange={setFile} accept="image/*" />
    </div>
  );
};

const FILE_DROPZONE_DOC: CompositeDoc = {
  overview: (
    <>
      FileDropzone is a drag-and-drop single-file picker with a click-to-browse fallback. Once a file is
      selected it swaps the drop area for a compact name/size summary with a remove button, rather than
      showing both at once. Enterprise use cases: the file-upload slot in EntityFormDialog (e.g. creating
      an Asset), avatar/logo uploads.
    </>
  ),
  importStatement: "import { FileDropzone } from '@inithium/ui';",
  composition: [
    { name: 'native <input type="file">', role: 'Hidden, triggered programmatically by clicking or pressing Enter/Space on the drop area.' },
    { name: 'Button', role: 'The remove (X) action shown once a file is selected.' },
    { name: 'Text', role: 'File name, formatted size, and the drop-area instructions.' },
  ],
  propGroups: [
    {
      component: 'FileDropzone',
      props: [
        { name: 'value', type: 'File | null', required: true, description: 'The currently selected file.' },
        { name: 'onChange', type: '(file: File | null) => void', required: true, description: 'Called with the new file, or null when removed.' },
        { name: 'accept', type: 'string', description: 'Passed straight through to the native file input\'s accept attribute.' },
        { name: 'error', type: 'boolean | string', description: 'Marks the field invalid and switches its border to the destructive palette.' },
        { name: 'disabled', type: 'boolean', description: 'Disables both the drop area and the remove action.' },
      ],
    },
  ],
  examples: [
    {
      title: 'Single image upload',
      code: `const [file, setFile] = useState<File | null>(null);

<FileDropzone value={file} onChange={setFile} accept="image/*" />`,
      preview: <FileDropzoneDemo />,
    },
  ],
};

export const FileDropzoneDoc = () => <CompositeDocView doc={FILE_DROPZONE_DOC} />;
