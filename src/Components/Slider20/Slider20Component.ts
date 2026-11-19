import { Slider20 } from './Slider20';
import { ComponentSchemaV1, SchemaDisplayRule, SchemaProperty } from '../../types/SchemaV1';

// Variant 'b' replaces the caption with a button. Its settings mirror SimpleButton's,
// prefixed with `button` so they don't collide with the slider's own keys.
const BUTTON_COLOR_KEYS = [
  'buttonBackgroundColor',
  'buttonTextColor',
  'buttonBorderColor',
  'buttonIconColor',
  'buttonBoxShadowColor',
  'buttonInnerBoxShadowColor',
];

function buttonColor(name: string): SchemaProperty {
  return {
    type: 'string',
    scope: 'common',
    title: `Button ${name}`,
    titleByState: {
      default: `Button ${name}`,
      hover: `Button ${name} Hover`,
      active: `Button ${name} Active`,
    },
    display: { type: 'palette-color-picker' },
  };
}

const shadowDisplay = {
  type: 'padding-controls',
  step: 0.1,
  decimal: true,
  allowNegative: true,
  nonNegativeSides: ['right'],
  sideLetters: { top: 'Y', left: 'X', right: 'B', bottom: 'S' },
};

const buttonProperties: Record<string, SchemaProperty> = {
  buttonType: {
    type: 'string',
    scope: 'layout',
    title: '',
    display: { type: 'radio-group' },
    enum: ['a', 'b', 'c'],
  },
  buttonLabel: {
    type: 'string',
    scope: 'common',
    title: 'Label',
    display: { type: 'label-input' },
  },
  buttonIcon: {
    type: ['string', 'null'] as const,
    scope: 'common',
    title: 'Icon',
    display: { type: 'settings-image-input', visible: false },
  },
  buttonPosition: {
    type: 'string',
    scope: 'layout',
    title: 'Position',
    display: { type: 'toggle-cycle', enum: ['left', 'center', 'right'] },
  },
  buttonAlignment: {
    type: 'string',
    scope: 'layout',
    title: 'Alignment',
    display: { type: 'toggle-cycle', enum: ['left', 'center', 'right'] },
  },
  buttonAlignA: {
    type: 'string',
    scope: 'layout',
    title: 'Alignment',
    display: { type: 'toggle-cycle', enum: ['left', 'center', 'right'], visible: false },
  },
  buttonOrder: {
    type: 'string',
    scope: 'layout',
    title: 'Order',
    display: { type: 'toggle-cycle', enum: ['text-icon', 'icon-text'], visible: false },
  },
  buttonGap: {
    type: 'number',
    scope: 'layout',
    title: 'Gap',
    display: { type: 'numeric-input', visible: false },
    min: 0,
    max: 9999,
  },
  buttonIconSize: {
    type: 'number',
    scope: 'layout',
    title: 'Icon width',
    display: { type: 'numeric-input', visible: false },
    min: 0,
    max: 9999,
  },
  buttonIconWidthC: {
    type: 'number',
    scope: 'layout',
    title: 'Icon width',
    display: { type: 'numeric-input', visible: false },
    min: 0,
    max: 9999,
  },
  buttonDimensions: {
    type: 'boolean',
    scope: 'layout',
    title: 'Dimensions',
    display: { type: 'toggle', enum: ['auto', 'fixed'] },
  },
  buttonPadding: {
    type: 'object',
    scope: 'layout',
    title: 'Padding',
    display: { type: 'padding-controls' },
  },
  buttonCornerRadius: {
    type: 'number',
    scope: 'layout',
    title: 'Corner radius',
    min: 0,
    display: { type: 'numeric-input' },
  },
  buttonBoxShadow: {
    type: 'object',
    scope: 'layout',
    title: 'Shadow',
    display: shadowDisplay,
  },
  buttonInnerBoxShadow: {
    type: 'object',
    scope: 'layout',
    title: 'Inner shadow',
    display: shadowDisplay,
  },
  buttonStroke: {
    type: 'number',
    scope: 'layout',
    title: 'Stroke Width',
    display: { type: 'numeric-input' },
    min: 0,
    max: 9999,
  },
  buttonBlur: {
    type: 'number',
    scope: 'layout',
    title: 'Blur',
    display: { type: 'numeric-input' },
    min: 0,
    max: 100,
  },
  buttonHoverEffect: {
    type: 'string',
    scope: 'layout',
    title: 'Hover effect',
    display: { type: 'toggle-cycle', enum: ['none', 'scale-up', 'lift', 'reveal', 'swipe', 'content-roll'] },
  },
  buttonMinWidth: {
    type: 'number',
    scope: 'layout',
    title: 'Min width',
    display: { type: 'numeric-input' },
    min: 0,
    max: 9999,
  },
  buttonMinHeight: {
    type: 'number',
    scope: 'layout',
    title: 'Min height',
    display: { type: 'numeric-input' },
    min: 0,
    max: 9999,
  },
  buttonWidth: {
    type: 'number',
    scope: 'layout',
    title: 'Width',
    display: { type: 'numeric-input', visible: false },
    min: 0,
    max: 9999,
  },
  buttonHeight: {
    type: 'number',
    scope: 'layout',
    title: 'Height',
    display: { type: 'numeric-input', visible: false },
    min: 0,
    max: 9999,
  },
  buttonBackgroundColor: buttonColor('BG'),
  buttonTextColor: buttonColor('Text'),
  buttonBorderColor: buttonColor('Border'),
  buttonIconColor: buttonColor('Icon'),
  buttonBoxShadowColor: buttonColor('Shadow'),
  buttonInnerBoxShadowColor: buttonColor('Inner Shadow'),
  stateOverrides: {
    type: 'object',
    scope: 'common',
  },
  buttonFontFamily: {
    type: 'string',
    scope: 'common',
    title: 'Font family',
    display: { type: 'font-family-select' },
  },
  buttonFontSettings: {
    type: 'object',
    scope: 'common',
    title: '',
    display: { type: 'font-settings-weight' },
    properties: {
      fontWeight: { type: 'number' },
      fontStyle: { type: 'string' },
    },
  },
  buttonFontSize: {
    type: 'number',
    scope: 'layout',
    title: 'Font Size',
    display: { type: 'font-size' },
  },
  buttonLineHeight: {
    type: 'number',
    scope: 'layout',
    title: 'Line Height',
    display: { type: 'line-height-input' },
  },
  buttonLetterSpacing: {
    type: 'number',
    scope: 'layout',
    title: 'Letter Spacing',
    display: { type: 'letter-spacing-input' },
  },
  buttonWordSpacing: {
    type: 'number',
    scope: 'layout',
    title: 'Word Spacing',
    display: { type: 'word-spacing-input' },
  },
  buttonTextAppearance: {
    type: 'object',
    scope: 'layout',
    title: 'Text Appearance',
    display: { type: 'text-appearance' },
  },
};

const BUTTON_TYPOGRAPHY_KEYS = [
  'buttonFontFamily',
  'buttonFontSettings',
  'buttonFontSize',
  'buttonLineHeight',
  'buttonLetterSpacing',
  'buttonWordSpacing',
  'buttonTextAppearance',
];

const TITLE_KEYS = [
  'titleColor',
  'linkColor',
  'titleFontFamily',
  'titleFontSettings',
  'titleFontSize',
  'titleLineHeight',
  'titleLetterSpacing',
  'titleWordSpacing',
  'titleTextAppearance',
];

function hideWhen(condition: { name: string; value: unknown; isNotEqual?: boolean }, keys: string[]): SchemaDisplayRule[] {
  return keys.map((key) => ({
    if: condition,
    then: { name: `properties.${key}.display.visible`, value: false },
  }));
}

function buttonTypeRule(buttonType: 'a' | 'b' | 'c', path: string, value: boolean): SchemaDisplayRule {
  return {
    if: { name: 'buttonType', value: buttonType },
    then: { name: `properties.${path}`, value },
  };
}

// Same rules as SimpleButton, on the prefixed keys.
const buttonDisplayRules: SchemaDisplayRule[] = [
  buttonTypeRule('a', 'buttonIcon.display.visible', false),
  buttonTypeRule('a', 'buttonAlignment.display.visible', false),
  buttonTypeRule('a', 'buttonAlignA.display.visible', true),
  buttonTypeRule('a', 'buttonIconColor.display.visible', false),
  buttonTypeRule('b', 'buttonIcon.display.visible', true),
  buttonTypeRule('b', 'buttonLabel.display.visible', false),
  ...BUTTON_TYPOGRAPHY_KEYS.map((key) => buttonTypeRule('b', `${key}.display.enabled`, false)),
  buttonTypeRule('b', 'buttonIconSize.display.visible', true),
  buttonTypeRule('c', 'buttonIcon.display.visible', true),
  buttonTypeRule('c', 'buttonOrder.display.visible', true),
  buttonTypeRule('c', 'buttonIconWidthC.display.visible', true),
  buttonTypeRule('c', 'buttonGap.display.visible', true),
  {
    if: { name: 'buttonStroke', value: 0 },
    then: { name: 'properties.buttonBorderColor.display.visible', value: false },
  },
  {
    if: { name: 'buttonDimensions', value: true },
    then: { name: 'properties.buttonMinWidth.display.visible', value: false },
  },
  {
    if: { name: 'buttonDimensions', value: true },
    then: { name: 'properties.buttonMinHeight.display.visible', value: false },
  },
  {
    if: { name: 'buttonDimensions', value: true },
    then: { name: 'properties.buttonWidth.display.visible', value: true },
  },
  {
    if: { name: 'buttonDimensions', value: true },
    then: { name: 'properties.buttonHeight.display.visible', value: true },
  },
];

// Applied last, so they win over the rules above (the editor applies rules in order).
// Anything but 'b' counts as 'a', so sliders saved before the variant existed keep the caption.
const variantDisplayRules: SchemaDisplayRule[] = [
  ...hideWhen(
    { name: 'type', value: 'b', isNotEqual: true },
    Object.keys(buttonProperties).filter((key) => key !== 'stateOverrides'),
  ),
  ...hideWhen({ name: 'type', value: 'b' }, TITLE_KEYS),
];

function buttonLayoutDefaults(width: number) {
  return {
    type: 'a',
    buttonType: 'a',
    buttonPosition: 'left',
    buttonAlignment: 'center',
    buttonAlignA: 'center',
    buttonOrder: 'text-icon',
    buttonDimensions: false,
    buttonPadding: {
      top: 10 / width,
      right: 20 / width,
      bottom: 10 / width,
      left: 20 / width,
    },
    buttonMinWidth: 0,
    buttonMinHeight: 0,
    buttonWidth: 100 / width,
    buttonHeight: 100 / width,
    buttonCornerRadius: 20 / width,
    buttonBoxShadow: { top: 0, left: 0, right: 0, bottom: 0 },
    buttonInnerBoxShadow: { top: 0, left: 0, right: 0, bottom: 0 },
    buttonStroke: 0,
    buttonBlur: 0,
    buttonHoverEffect: 'none',
    buttonIconSize: 16 / width,
    buttonGap: 10 / width,
    buttonIconWidthC: 16 / width,
    buttonFontSize: 16 / width,
    buttonLineHeight: 16 / width,
    buttonLetterSpacing: 0,
    buttonWordSpacing: 0,
    buttonTextAppearance: {
      textTransform: 'none',
      textDecoration: 'none',
      fontVariant: 'normal',
    },
  };
}

const schema: ComponentSchemaV1 = {
  type: 'object',
  version: 1,
  settings: {
    sizing: 'manual',
    properties: {
      type: {
        type: 'string',
        scope: 'layout',
        title: '',
        display: { type: 'radio-group' },
        enum: ['a', 'b'],
      },
      trigger: {
        type: 'object',
        scope: 'common',
        title: 'Trigger',
        display: {
          type: 'toggle-cycle-numeric-input',
          enum: ['click', 'drag', 'auto'],
          inputs: {
            click: 'none',
            drag: 'none',
            auto: 'single',
          },
          defaultValue: 3,
          showDash: false,
        },
        min: 1,
        max: 5,
        properties: {
          sizeType: { type: 'string' },
          value: { type: 'number' },
          min: { type: 'number' },
          max: { type: 'number' },
        },
      },
      direction: {
        type: 'string',
        scope: 'common',
        title: 'Direction',
        display: { type: 'toggle-cycle', enum: ['horizontal', 'vertical'] },
      },
      transition: {
        type: 'string',
        scope: 'common',
        title: 'Transition',
        display: { type: 'toggle-cycle', enum: ['slide', 'fade in', 'reveal'] },
      },
      nav: {
        type: 'string',
        scope: 'common',
        title: 'Nav',
        display: { type: 'toggle-cycle', enum: ['classic', 'no'] },
      },
      navSize: {
        type: 'string',
        scope: 'layout',
        title: 'Nav Size',
        display: { type: 'toggle-cycle', enum: ['s', 'm', 'l'] },
      },
      navUnit: {
        type: 'number',
        scope: 'layout',
        title: '',
        display: { type: 'numeric-input', visible: false },
        min: 0,
        max: 1,
      },
      controls: {
        type: ['string', 'null'] as const,
        scope: 'common',
        title: '',
        display: { type: 'settings-image-input' },
      },
      controlsMaxWidth: {
        type: 'number',
        scope: 'layout',
        title: 'Max Width',
        display: { type: 'numeric-input' },
        min: 0,
        max: 9999,
      },
      show: {
        type: 'string',
        scope: 'common',
        title: 'Show',
        display: { type: 'toggle-cycle', enum: ['always', 'on hover', 'never'] },
      },
      paddingX: {
        type: 'number',
        scope: 'layout',
        title: 'Padding X',
        display: { type: 'numeric-input' },
        min: -9999,
        max: 9999,
      },
      paddingY: {
        type: 'number',
        scope: 'layout',
        title: 'Padding Y',
        display: { type: 'numeric-input' },
        min: -9999,
        max: 9999,
      },
      controlsColor: {
        type: 'string',
        scope: 'common',
        title: 'Controls Default',
        display: { type: 'palette-color-picker' },
      },
      controlsHoverColor: {
        type: 'string',
        scope: 'common',
        title: 'Controls Hover',
        display: { type: 'palette-color-picker' },
      },
      navColor: {
        type: 'string',
        scope: 'common',
        title: 'Dot Nav',
        display: { type: 'palette-color-picker' },
      },
      navPaginationColor: {
        type: 'string',
        scope: 'common',
        title: 'Active Nav',
        display: { type: 'palette-color-picker' },
      },
      navBackgroundColor: {
        type: 'string',
        scope: 'common',
        title: 'BG Nav',
        display: { type: 'palette-color-picker' },
      },
      linkColor: {
        type: 'string',
        scope: 'common',
        title: 'Link Default',
        display: { type: 'palette-color-picker' },
      },
      titleColor: {
        type: 'string',
        scope: 'common',
        title: 'Text Default',
        display: { type: 'palette-color-picker' },
      },
      titleFontFamily: {
        type: 'string',
        scope: 'common',
        title: 'Font family',
        display: { type: 'font-family-select' },
      },
      titleFontSettings: {
        type: 'object',
        scope: 'common',
        title: '',
        display: { type: 'font-settings-weight' },
        properties: {
          fontWeight: { type: 'number' },
          fontStyle: { type: 'string' },
        },
      },
      titleFontSize: {
        type: 'number',
        scope: 'layout',
        title: 'Font Size',
        display: { type: 'font-size' },
      },
      titleLineHeight: {
        type: 'number',
        scope: 'layout',
        title: 'Line Height',
        display: { type: 'line-height-input' },
      },
      titleLetterSpacing: {
        type: 'number',
        scope: 'layout',
        title: 'Letter Spacing',
        display: { type: 'letter-spacing-input' },
      },
      titleWordSpacing: {
        type: 'number',
        scope: 'layout',
        title: 'Word Spacing',
        display: { type: 'word-spacing-input' },
      },
      titleTextAppearance: {
        type: 'object',
        scope: 'layout',
        title: 'Text Appearance',
        display: { type: 'text-appearance' },
        properties: {
          textTransform: { type: 'string', enum: ['none', 'uppercase', 'lowercase', 'capitalize'] },
          textDecoration: { type: 'string', enum: ['none', 'underline'] },
          fontVariant: { type: 'string', enum: ['normal', 'small-caps'] },
        },
      },
      captionMarginTop: {
        type: 'number',
        scope: 'layout',
        title: 'Caption margin top',
        min: 0,
        max: 100,
        display: { type: 'range-control' },
      },
      ...buttonProperties,
    },
    defaults: {
      trigger: {
        sizeType: 'drag',
        value: 3,
        min: 1,
        max: 5,
      },
      direction: 'horizontal',
      transition: 'slide',
      nav: 'classic',
      
      controls: null,
      show: 'always',
      controlsColor: '#000000',
      controlsHoverColor: '#3F3F3F',
      navColor: '#A4A4A4',
      navPaginationColor: '#FFFFFF',
      navBackgroundColor: '#000000',
      linkColor: '#2E12F0',
      titleColor: '#000000',
      titleFontFamily: 'Arial',
      titleFontSettings: {
        fontWeight: 400,
        fontStyle: 'normal',
      },
      titleLetterSpacing: 0,
      titleWordSpacing: 0,
      titleTextAppearance: {
        textTransform: 'none',
        textDecoration: 'none',
        fontVariant: 'normal',
      },
      buttonLabel: 'Button',
      buttonIcon: 'https://cdn.cntrl.site/projects/01JJKT02AWY2FGN2QJ7A173RNZ/articles-assets/01KY78A0YVT403B042HVWWTHBC.svg',
      buttonBackgroundColor: '#2E12F0',
      buttonTextColor: '#ffffff',
      buttonBorderColor: '#ffffff',
      buttonIconColor: '#ffffff',
      buttonBoxShadowColor: '#000000',
      buttonInnerBoxShadowColor: '#000000',
      buttonFontFamily: 'Arial',
      buttonFontSettings: {
        fontWeight: 400,
        fontStyle: 'normal',
      },
      stateOverrides: {
        hover: {
          buttonBackgroundColor: '#3642EF',
        },
        active: {
          buttonBackgroundColor: '#475FFF',
        },
      },
    },
    layoutDefaults: {
      d: {
        ...buttonLayoutDefaults(1440),
        controlsMaxWidth: 30 / 1440,
        paddingX: 0,
        paddingY: 0,
        captionMarginTop: 10 / 1440,
        titleFontSize: 16 / 1440,
        titleLineHeight: 16 / 1440,
        navSize: 'm',
        navUnit: 1 / 1440,
      },
      t: {
        ...buttonLayoutDefaults(768),
        controlsMaxWidth: 30 / 768,
        paddingX: -10 / 768,
        paddingY: 0,
        captionMarginTop: 10 / 768,
        titleFontSize: 16 / 768,
        titleLineHeight: 16 / 768,
        navSize: 'm',
        navUnit: 1 / 768,
      },
      m: {
        ...buttonLayoutDefaults(375),
        controlsMaxWidth: 30 / 375,
        paddingX: -14 / 375,
        paddingY: 0,
        captionMarginTop: 10 / 375,
        titleFontSize: 16 / 375,
        titleLineHeight: 16 / 375,
        navSize: 'm',
        navUnit: 1 / 375,
      },
    },
    displayRules: [
      {
        if: { name: 'show', value: 'never' },
        then: { name: 'properties.controlsColor.display.visible', value: false },
      },
      {
        if: { name: 'show', value: 'never' },
        then: { name: 'properties.controlsHoverColor.display.visible', value: false },
      },
      {
        if: { name: 'nav', value: 'no' },
        then: { name: 'properties.navColor.display.visible', value: false },
      },
      {
        if: { name: 'nav', value: 'no' },
        then: { name: 'properties.navPaginationColor.display.visible', value: false },
      },
      {
        if: { name: 'nav', value: 'no' },
        then: { name: 'properties.navBackgroundColor.display.visible', value: false },
      },
      {
        if: { name: 'nav', value: 'no' },
        then: { name: 'properties.navSize.display.visible', value: false },
      },
      ...buttonDisplayRules,
      ...variantDisplayRules,
    ],
    layout: [
      '__componentName__',
      'type',
      'trigger',
      'direction',
      'transition',
      'nav',
      'navSize',
      'controls',
      'controlsMaxWidth',
      'show',
      'paddingX',
      'paddingY',
      'captionMarginTop',
      'titleFontSize',
      'titleLineHeight',
      'titleLetterSpacing',
      'titleWordSpacing',
      'buttonType',
      'buttonPosition',
      'buttonLabel',
      'buttonIcon',
      'buttonAlignment',
      'buttonOrder',
      'buttonGap',
      'buttonIconSize',
      'buttonIconWidthC',
      'buttonHoverEffect',
      { type: 'row', title: '', items: ['buttonDimensions', 'buttonPadding'] },
      'buttonCornerRadius',
      'buttonBlur',
      'buttonBoxShadow',
      'buttonInnerBoxShadow',
      'buttonStroke',
      { type: 'row', title: '', items: ['buttonMinWidth', 'buttonMinHeight', 'buttonWidth', 'buttonHeight'] },
      'buttonFontSize',
      'buttonLineHeight',
      'buttonLetterSpacing',
      'buttonWordSpacing',
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
        'type',
        { type: 'row', title: '', items: ['trigger', 'direction'] },
        { type: 'row', title: '', items: ['transition', 'nav'] },
        { type: 'row', title: '', items: ['navSize'] },
        {
          type: 'group',
          title: 'Controls',
          items: [
            { type: 'row', title: '', items: ['controls', 'controlsMaxWidth'] },
            { type: 'row', title: '', items: ['paddingX', 'paddingY'] },
            { type: 'row', title: '', items: ['show'] },
          ],
        },
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
          title: 'Title',
          items: [
            'titleFontFamily',
            'titleFontSettings',
            { type: 'row', items: ['titleFontSize', 'titleLineHeight', 'titleLetterSpacing', 'titleWordSpacing'] },
            'titleTextAppearance',
          ],
        },
        {
          type: 'group',
          title: 'Button',
          items: [
            'buttonFontFamily',
            'buttonFontSettings',
            { type: 'row', items: ['buttonFontSize', 'buttonLineHeight', 'buttonLetterSpacing', 'buttonWordSpacing'] },
            'buttonTextAppearance',
          ],
        },
      ],
    },
    {
      id: 'button',
      icon: 'target',
      title: 'Button',
      tooltip: 'Button Settings',
      // Only variant 'b' has a button. The editor hides this tab otherwise.
      availableWhen: { type: ['b'] },
      layout: [
        '__componentName__',
        'buttonType',
        { type: 'row', title: '', items: ['buttonPosition'] },
        { type: 'row', title: '', items: ['buttonLabel', 'buttonIcon', 'buttonIconSize', 'buttonAlignA'] },
        { type: 'row', title: '', items: ['buttonAlignment', 'buttonOrder'] },
        { type: 'row', title: '', items: ['buttonGap', 'buttonIconWidthC'] },
        { type: 'row', title: '', items: ['buttonDimensions', 'buttonPadding'] },
        { type: 'row', title: '', items: ['buttonMinWidth', 'buttonMinHeight', 'buttonWidth', 'buttonHeight'] },
        { type: 'row', title: '', items: ['buttonHoverEffect', 'buttonCornerRadius'] },
        { type: 'row', title: '', items: ['buttonBlur'] },
        { type: 'row', title: '', items: ['buttonBoxShadow'] },
        { type: 'row', title: '', items: ['buttonInnerBoxShadow'] },
        { type: 'row', title: '', items: ['buttonStroke'] },
      ],
    },
  ],
  paletteBookmark: {
    items: [
      'controlsColor',
      'controlsHoverColor',
      'navPaginationColor',
      'navColor',
      'navBackgroundColor',
      'titleColor',
      'linkColor',
      ...BUTTON_COLOR_KEYS,
    ],
    panelIds: ['general', 'typeStyle', 'button'],
    stateItems: {
      default: [
        'controlsColor',
        'controlsHoverColor',
        'navPaginationColor',
        'navColor',
        'navBackgroundColor',
        'titleColor',
        'linkColor',
        ...BUTTON_COLOR_KEYS,
      ],
      hover: [...BUTTON_COLOR_KEYS],
      active: [...BUTTON_COLOR_KEYS],
    },
  },
  states: ['default', 'hover', 'active'],
  content: {
    type: 'array',
    settings: {
      addItemFromFileExplorer: true,
    },
    // Variant 'b' swaps the Description column for a per-slide Link (the button's target).
    display: {
      type: 'array',
      rules: [
        { if: { name: 'type', value: 'b' }, then: { name: 'imageCaption', value: false } },
        { if: { name: 'type', value: 'b', isNotEqual: true }, then: { name: 'link', value: false } },
      ],
    },
    items: {
      type: 'object',
      properties: {
        image: {
          type: 'object',
          label: 'Image',
          display: {
            type: 'media-input',
          },
          properties: {
            url: { type: 'string' },
            name: { type: 'string' },
            objectFit: { type: 'string', enum: ['cover', 'contain'] },
          },
          required: ['url', 'name'],
        },
        imageCaption: {
          placeholder: 'Add Caption...',
          label: 'Description',
          display: { type: 'rich-text' },
        },
        link: {
          placeholder: 'Add link',
          label: 'Link',
          display: { type: 'link-input' },
        },
      },
      required: ['image'],
    },
    default: [
      {
        image: {
          objectFit: 'cover',
          url: 'https://cdn.cntrl.site/component-assets/Component-default-1.jpg',
        },
        imageCaption: [
          { type: 'paragraph', children: [{ text: 'Earth-orbital mission' }] },
        ],
      },
      {
        image: {
          objectFit: 'cover',
          url: 'https://cdn.cntrl.site/component-assets/Component-default-11.jpg',
        },
        imageCaption: [
          { type: 'paragraph', children: [{ text: 'Salton Sea from Above' }] },
        ],
      },
      {
        image: {
          objectFit: 'cover',
          url: 'https://cdn.cntrl.site/component-assets/Component-default-3.jpg',
        },
        imageCaption: [
          { type: 'paragraph', children: [{ text: 'Lunar Module Pilot' }] },
        ],
      },
      {
        image: {
          objectFit: 'cover',
          url: 'https://cdn.cntrl.site/component-assets/Component-default-2.jpg',
        },
        imageCaption: [
          { type: 'paragraph', children: [{ text: 'Lunar Module 3 porch' }] },
        ],
      },
      {
        image: {
          objectFit: 'cover',
          url: 'https://cdn.cntrl.site/component-assets/Component-default-5.jpg',
        },
        imageCaption: [
          { type: 'paragraph', children: [{ text: 'Command Module' }] },
        ],
      },
    ],
  },
};

export const Slider20Component = {
  element: Slider20,
  id: 'slider-2-0',
  name: 'Slider 2.0',
  category: 'galleries',
  version: 1,
  defaultSize: {
    d: {
      width: 400,
      height: 400,
    },
    t: {
      width: 400,
      height: 400,
    },
    m: {
      width: 300,
      height: 300,
    },
  },
  preview: {
    type: 'image' as const,
    url: 'https://cdn.cntrl.site/component-assets/Slider.mp4',
  },
  schema,
  assetsPaths: {
    content: [{ path: 'image.url', placeholderEnabled: true }],
    parameters: [{ path: 'controls' }, { path: 'buttonIcon' }],
  },
  fontSettingsPaths: {
    content: [],
    parameters: [{ path: 'titleFontFamily' }, { path: 'buttonFontFamily' }],
  },
  fontRelations: {
    titleFontSettings: 'titleFontFamily',
    buttonFontSettings: 'buttonFontFamily',
  },
};
