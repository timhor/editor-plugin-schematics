import { Tree } from '@angular-devkit/schematics';
import { SchematicTestRunner } from '@angular-devkit/schematics/testing';
import * as path from 'path';

const collectionPath = path.join(__dirname, '../collection.json');

describe('twp-editor-plugin', () => {
  it('works', () => {
    const runner = new SchematicTestRunner('schematics', collectionPath);
    const tree = runner.runSchematic(
      'twp-editor-plugin',
      { name: 'my awesome plugin', usePluginState: false },
      Tree.empty()
    );

    expect(tree.files).toEqual(['/my-awesome-plugin/index.tsx']);
  });
});
