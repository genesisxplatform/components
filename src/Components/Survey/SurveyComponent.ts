import { Survey } from './Survey';
import { ComponentSchemaV1 } from '../../types/SchemaV1';

const fontSettingsProperty = {
  type: 'object' as const,
  scope: 'common' as const,
  title: '',
  display: { type: 'font-settings-weight' },
  properties: {
    fontWeight: { type: 'number' as const },
    fontStyle: { type: 'string' as const },
  },
};

function createNumericLayoutProperty(title: string) {
  return {
    type: 'number' as const,
    scope: 'layout' as const,
    title,
    display: { type: 'numeric-input' as const },
    min: 0,
    max: 9999,
  };
}

// Spacing that the editor can also drag on the canvas (spacer elements with data-controls).
function createSpacingLayoutProperty(title: string) {
  return {
    type: 'number' as const,
    scope: 'layout' as const,
    title,
    min: 0,
    max: 200,
    display: { type: 'range-control' as const },
  };
}

function createColorProperty(title: string) {
  return {
    type: 'string' as const,
    scope: 'common' as const,
    title,
    display: { type: 'palette-color-picker' as const },
  };
}

const paletteBookmarkItems = [
  'questionColor',
  'answerColor',
  'answerSelectedColor',
  'answerBgColor',
  'answerSelectedBgColor',
  'iconColor',
  'iconSelectedColor',
  'buttonColor',
  'buttonTextColor',
] as const;

const defaultIcon = (url: string) => ({ objectFit: 'contain', url, name: '' });
const defaultIconUrl = 'https://cdn.cntrl.site/projects/01JJKT02AWY2FGN2QJ7A173RNZ/articles-assets/01M0GB8Z9EQFMGYA20F2J0ACA8.svg';

const schema: ComponentSchemaV1 = {
  type: 'object',
  version: 1,
  content: {
    type: 'array',
    display: {
      type: 'array',
    },
    items: {
      type: 'object',
      properties: {
        question: {
          type: 'string',
          label: 'Question',
          placeholder: 'Add question...',
          display: {
            type: 'text-input',
          },
        },
        answers: {
          type: 'array',
          label: 'Answers',
          placeholder: 'Add answer...',
          display: {
            type: 'icon-text-list-input',
            addLabel: '+ Add answer',
          },
          items: {
            type: 'object',
            properties: {
              icon: {
                type: 'object',
                properties: {
                  url: { type: 'string' },
                  name: { type: 'string' },
                  objectFit: { type: 'string', enum: ['cover', 'contain'] },
                },
              },
              text: { type: 'string' },
              iconPosition: { type: 'string', enum: ['before', 'after'] },
            },
          },
          default: [
            { icon: defaultIcon(defaultIconUrl), text: 'Answer', iconPosition: 'before' },
          ],
        },
      },
    },
    default: [
      {
        question: 'How did you hear about us?',
        answers: [
          { icon: defaultIcon(defaultIconUrl), text: 'Search engine', iconPosition: 'before' },
          { icon: defaultIcon(defaultIconUrl), text: 'Social media', iconPosition: 'before' },
          { icon: defaultIcon(defaultIconUrl), text: 'A friend', iconPosition: 'before' },
        ],
      },
    ],
  },
  settings: {
    sizing: 'auto manual',
    properties: {
      selectionCount: {
        type: 'string',
        scope: 'common',
        title: 'Selection',
        display: { type: 'toggle-cycle', enum: ['one', 'many'] },
      },
      submitLabel: {
        type: 'string',
        scope: 'common',
        title: 'Label',
        display: { type: 'text-input' },
      },
      submitLink: {
        type: 'object',
        scope: 'common',
        title: 'Link',
        message: 'Add link',
        display: { type: 'link-input' },
      },
      questionGap: createSpacingLayoutProperty(' Questions'),
      questionAnswersGap: createSpacingLayoutProperty('Question to Answers'),
      answerGap: createSpacingLayoutProperty('Between Answers'),
      iconGap: createNumericLayoutProperty('Icon to Text'),
      buttonPaddingTop: createSpacingLayoutProperty('Button Top'),
      answerRadius: createNumericLayoutProperty('radius'),
      buttonRadius: createNumericLayoutProperty('Radius'),
      answerPadding: {
        type: 'object' as const,
        scope: 'layout' as const,
        title: 'Padding',
        display: { type: 'padding-controls' as const },
      },
      buttonPadding: {
        type: 'object' as const,
        scope: 'layout' as const,
        title: 'Padding',
        display: { type: 'padding-controls' as const },
      },
      align: {
        type: 'string',
        scope: 'layout',
        title: 'Align',
        display: { type: 'toggle-cycle', enum: ['left', 'center', 'right'] },
      },
      answerWidth: createNumericLayoutProperty('Width'),
      buttonWidth: {
        type: 'string',
        scope: 'layout',
        title: 'Width',
        display: { type: 'toggle-cycle', enum: ['auto', 'full'] },
      },
      iconSize: createNumericLayoutProperty('Icon Size'),
      questionColor: createColorProperty('Question'),
      answerColor: createColorProperty('Answer Default'),
      answerSelectedColor: createColorProperty('Answer Selected'),
      answerBgColor: createColorProperty('Answer BG Default'),
      answerSelectedBgColor: createColorProperty('Answer BG Selected'),
      iconColor: createColorProperty('Icon Default'),
      iconSelectedColor: createColorProperty('Icon Selected'),
      buttonColor: createColorProperty('Fill Button'),
      buttonTextColor: createColorProperty('Label Button'),
      questionFontFamily: {
        type: 'string',
        scope: 'common',
        title: 'Font family',
        display: { type: 'font-family-select' },
      },
      questionFontSettings: fontSettingsProperty,
      questionFontSize: {
        type: 'number',
        scope: 'layout',
        title: 'Question Font Size',
        display: { type: 'font-size' },
      },
      questionLineHeight: {
        type: 'number',
        scope: 'layout',
        title: 'Question Line Height',
        display: { type: 'line-height-input' },
      },
      answerFontFamily: {
        type: 'string',
        scope: 'common',
        title: 'Font family',
        display: { type: 'font-family-select' },
      },
      answerFontSettings: fontSettingsProperty,
      answerFontSize: {
        type: 'number',
        scope: 'layout',
        title: 'Answer Font Size',
        display: { type: 'font-size' },
      },
      answerLineHeight: {
        type: 'number',
        scope: 'layout',
        title: 'Answer Line Height',
        display: { type: 'line-height-input' },
      },
      buttonFontFamily: {
        type: 'string',
        scope: 'common',
        title: 'Font family',
        display: { type: 'font-family-select' },
      },
      buttonFontSettings: fontSettingsProperty,
      buttonFontSize: {
        type: 'number',
        scope: 'layout',
        title: 'Button Font Size',
        display: { type: 'font-size' },
      },
      buttonLineHeight: {
        type: 'number',
        scope: 'layout',
        title: 'Button Line Height',
        display: { type: 'line-height-input' },
      },
    },
    defaults: {
      selectionCount: 'one',
      submitLabel: 'Submit',
      questionColor: '#000000',
      answerColor: '#000000',
      answerSelectedColor: '#A60239',
      answerBgColor: '#FFFFFF00',
      answerSelectedBgColor: '#FFFFFF00',
      iconColor: '#000000',
      iconSelectedColor: '#A60239',
      buttonColor: '#000000',
      buttonTextColor: '#FFFFFF',
      questionFontFamily: 'Inter',
      questionFontSettings: { fontWeight: 500, fontStyle: 'normal' },
      answerFontFamily: 'Inter',
      answerFontSettings: { fontWeight: 400, fontStyle: 'normal' },
      buttonFontFamily: 'Inter',
      buttonFontSettings: { fontWeight: 500, fontStyle: 'normal' },
    },
    layoutDefaults: {
      m: {
        answerWidth: 1,
        questionGap: 0.0853,
        questionAnswersGap: 0.0266,
        answerGap: 0.0266,
        iconGap: 0.0266,
        buttonPaddingTop: 0.0853,
        answerPadding: {top: 0, right: 0, bottom: 0, left: 0},
        answerRadius: 0,
        buttonRadius: 0,
        align: 'left',
        buttonWidth: 'auto',
        iconSize: 0.0533,
        questionFontSize: 0.064,
        questionLineHeight: 0.0746,
        answerFontSize: 0.0426,
        answerLineHeight: 0.0533,
        buttonFontSize: 0.0426,
        buttonPadding: { top: 0.0256, right: 0.0511, bottom: 0.0256, left: 0.0511 },
        buttonLineHeight: 0.0533,
      },
      t: {
        answerWidth: 0.651041,
        questionGap: 0.0390625,
        questionAnswersGap: 0.0130208,
        answerGap: 0.0130208,
        iconGap: 0.0130208,
        buttonPaddingTop: 0.0390625,
        answerPadding: {top: 0, right: 0, bottom: 0, left: 0},
        answerRadius: 0,
        buttonRadius: 0,
        align: 'left',
        buttonWidth: 'auto',
        iconSize: 0.02604166,
        questionFontSize: 0.03125,
        questionLineHeight: 0.0364583,
        answerFontSize: 0.0208333,
        answerLineHeight: 0.0260416,
        buttonFontSize: 0.0208333,
        buttonPadding: { top: 0.0125, right: 0.025, bottom: 0.0125, left: 0.025 },
        buttonLineHeight: 0.0260416,
      },
      d: {
        answerWidth: 0.5,
        questionGap: 0.0222,
        questionAnswersGap: 0.00833,
        answerGap: 0.00833,
        iconGap: 0.00833,
        buttonPaddingTop: 0.0222,
        answerPadding: {top: 0, right: 0, bottom: 0, left: 0},
        answerRadius: 0,
        buttonRadius: 0,
        align: 'left',
        buttonWidth: 'auto',
        iconSize: 0.01388,
        questionFontSize: 0.01666,
        questionLineHeight: 0.02083,
        answerFontSize: 0.01111,
        answerLineHeight: 0.01388,
        buttonFontSize: 0.01111,
        buttonPadding: { top: 0.0067, right: 0.0133, bottom: 0.0067, left: 0.0133 },
        buttonLineHeight: 0.01388,
      },
    },
    layout: [
      '__componentName__',
      'selectionCount',
      'submitLabel',
      'submitLink',
      'questionGap',
      'questionAnswersGap',
      'answerGap',
      'iconGap',
      'buttonPaddingTop',
      'iconSize',
      'answerPadding',
      'answerRadius',
      'buttonRadius',
      'buttonPadding',
      'align',
      'answerWidth',
      'buttonWidth',
    ],
  },
  panels: [
    {
      id: 'general',
      icon: 'settings',
      title: 'General',
      tooltip: 'General Settings',
      layout: [
        '__componentName__',
        { type: 'row', title: '', items: ['selectionCount', 'align'] },
        { type: 'row', title: 'Answer', items: ['answerWidth', 'iconSize'] },
        { type: 'row', title: '', items: ['answerPadding', 'answerRadius'] },
        { type: 'row', title: '', items: ['iconGap'] },
        { type: 'row', title: 'Button', items: ['buttonRadius', 'buttonWidth'] },
        { type: 'row', title: '', items: ['buttonPadding'] },
        { type: 'row', title: '', items: ['submitLabel'] },
        { type: 'row', title: '', items: ['submitLink'] },
      ],
    },
    {
      id: 'typeStyle',
      icon: 'text-icon',
      title: 'Type Style',
      tooltip: 'Typography',
      layout: [
        '__componentName__',
        {
          type: 'group',
          title: 'Question',
          items: [
            'questionFontFamily',
            'questionFontSettings',
            { type: 'row', items: ['questionFontSize', 'questionLineHeight'] },
          ],
        },
        {
          type: 'group',
          title: 'Answer',
          items: [
            'answerFontFamily',
            'answerFontSettings',
            { type: 'row', items: ['answerFontSize', 'answerLineHeight'] },
          ],
        },
        {
          type: 'group',
          title: 'Button',
          items: [
            'buttonFontFamily',
            'buttonFontSettings',
            { type: 'row', items: ['buttonFontSize', 'buttonLineHeight'] },
          ],
        },
      ],
    },
  ],
  paletteBookmark: {
    items: [...paletteBookmarkItems],
    panelIds: ['general', 'typeStyle'],
    stateItems: {
      default: [...paletteBookmarkItems],
    },
  },
};

export const SurveyComponent = {
  element: Survey,
  id: 'survey',
  name: 'Survey',
  category: 'forms',
  version: 1,
  preview: {
    type: 'image' as const,
    url: 'https://cdn.cntrl.site/component-assets/survey-test.png',
  },
  defaultSize: {
    d: {
      width: 720,
      height: 400,
    },
  },
  assetsPaths: {
    content: [{ path: 'answers.icon.url' }],
    parameters: [],
  },
  fontSettingsPaths: {
    content: [],
    parameters: [{ path: 'questionFontFamily' }, { path: 'answerFontFamily' }, { path: 'buttonFontFamily' }],
  },
  fontRelations: {
    questionFontSettings: 'questionFontFamily',
    answerFontSettings: 'answerFontFamily',
    buttonFontSettings: 'buttonFontFamily',
  },
  schema,
};
