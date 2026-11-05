import { useEffect, useMemo, useState } from 'react';
import cn from 'classnames';
import { CommonComponentProps } from '../props';
import { buildColorVars, scalingValue, useScopedStyles } from '../utils/index';
import { omitTextColors, TextStyles, textStylesToCss } from '../utils/textStylesToCss';
import { SvgImage } from '../helpers/SvgImage/SvgImage';

type SurveyAnswer = {
  icon?: {
    url?: string;
    name?: string;
    objectFit?: 'cover' | 'contain';
  };
  text?: string;
  iconPosition?: 'before' | 'after';
};

type SurveyContentItem = {
  question?: string;
  answers?: SurveyAnswer[];
};

/** Same shape the editor's LinkPanel produces (`Link` in @genesisxplatform/domain). */
export type SurveyLink =
  | {
    type: 'url' | 'anchor';
    value: string;
    target: 'self' | 'blank';
  }
  | {
    type: 'scene';
    value: string;
    duration: number;
    animation: 'fade' | 'slide' | 'reveal';
    direction?: 'north' | 'west' | 'south' | 'east';
    offset?: number;
    mode?: 'normal' | 'reverse';
    sceneSectionId?: string;
  };

/** Selected answer indices, one array per question, in content order. */
export type SurveyAnswers = number[][];

type FontSettings = { fontWeight: number; fontStyle: string };

type Align = 'left' | 'center' | 'right';

type Padding = { top: number; right: number; bottom: number; left: number };

type SpacingSetting = 'questionGap' | 'questionAnswersGap' | 'answerGap' | 'buttonPaddingTop';

const FLEX_ALIGN: Record<Align, string> = { left: 'flex-start', center: 'center', right: 'flex-end' };

type SurveySettings = {
  selectionCount?: 'one' | 'many';
  submitLabel?: string;
  submitLink?: SurveyLink | null;
  questionGap?: number;
  questionAnswersGap?: number;
  answerGap?: number;
  iconGap?: number;
  buttonPaddingTop?: number;
  answerPadding?: Padding;
  buttonPadding?: Padding;
  answerRadius?: number;
  buttonRadius?: number;
  answerBorderWidth?: number;
  buttonBorderWidth?: number;
  answerTexture?: string | null;
  buttonTexture?: string | null;
  /** Aligns the question, the answers column and the button together. */
  align?: Align;
  /** Width of the answers column, independent of the block width. */
  answerWidth?: number;
  answerColumns?: '1' | '2';
  buttonWidth?: 'auto' | 'full';
  iconSize?: number;
  questionColor?: string;
  answerColor?: string;
  answerSelectedColor?: string;
  answerBgColor?: string;
  answerSelectedBgColor?: string;
  answerBorderColor?: string;
  answerSelectedBorderColor?: string;
  iconColor?: string;
  iconSelectedColor?: string;
  buttonColor?: string;
  buttonTextColor?: string;
  buttonBorderColor?: string;
  questionFontFamily?: string;
  questionFontSettings?: FontSettings;
  questionFontSize?: number;
  questionLineHeight?: number;
  questionLetterSpacing?: number;
  questionWordSpacing?: number;
  questionTextAppearance?: TextStyles['textAppearance'];
  answerFontFamily?: string;
  answerFontSettings?: FontSettings;
  answerFontSize?: number;
  answerLineHeight?: number;
  answerLetterSpacing?: number;
  answerWordSpacing?: number;
  answerTextAppearance?: TextStyles['textAppearance'];
  buttonFontFamily?: string;
  buttonFontSettings?: FontSettings;
  buttonFontSize?: number;
  buttonLineHeight?: number;
  buttonLetterSpacing?: number;
  buttonWordSpacing?: number;
  buttonTextAppearance?: TextStyles['textAppearance'];
};

type SurveyProps = {
  settings: SurveySettings;
  content?: SurveyContentItem[];
  isEditor?: boolean;
  isPreviewMode?: boolean;
  isEditMode?: boolean;
  activeEvent?: string;
  /** Called with the selections before the submit link is followed. */
  onSubmit?: (answers: SurveyAnswers) => void;
  /**
   * Host-provided href for `url` and `anchor` links (the SDK's ComponentItem resolves
   * anchor section ids). Submit then renders as a real link. Without a host, only
   * `url` links get an href.
   */
  getLinkHref?: (link: SurveyLink) => { href: string; target?: '_blank' } | undefined;
  /** Host-provided scene transition (the SDK's ComponentItem); scenes need the site's transition machine. */
  onNavigate?: (link: SurveyLink) => void;
} & CommonComponentProps;

type ColorKeys =
  | 'questionColor'
  | 'answerColor'
  | 'answerSelectedColor'
  | 'iconColor'
  | 'iconSelectedColor'
  | 'buttonTextColor'
  | 'answerBorderColor'
  | 'answerSelectedBorderColor'
  | 'buttonBorderColor';

const COLOR_VAR_MAP: Record<ColorKeys, string> = {
  questionColor: 'question-color',
  answerColor: 'answer-color',
  answerSelectedColor: 'answer-selected-color',
  iconColor: 'icon-color',
  iconSelectedColor: 'icon-selected-color',
  buttonTextColor: 'button-text-color',
  answerBorderColor: 'answer-border-color',
  answerSelectedBorderColor: 'answer-selected-border-color',
  buttonBorderColor: 'button-border-color',
};

const GRADIENT_RE = /(^|[\s,])(repeating-)?(linear|radial|conic)-gradient\(/i;

function isGradient(value: string): boolean {
  return GRADIENT_RE.test(value);
}

function fillVars(P: string, name: string, value: string): Record<string, string> {
  const gradient = isGradient(value);
  return {
    [`--${P}-${name}-color`]: gradient ? 'transparent' : value,
    [`--${P}-${name}-image`]: gradient ? value : 'none',
  };
}

/** The texture sits under the fill, so the fill color's own alpha decides how much of it shows. */
function textureVars(P: string, name: string, url: string | null | undefined): Record<string, string> {
  return { [`--${P}-${name}-texture`]: url ? `url("${url.replace(/"/g, '%22')}")` : 'none' };
}

const STATE_KEYS = ['hover'] as const;

function getCSS(P: string): string {
  return `
.${P}-wrapper {
  box-sizing: border-box;
  display: flex;
  flex-direction: column;
  width: 100%;
}
.${P}-question-block {
  display: flex;
  flex-direction: column;
  min-width: 0;
}
/* Vertical spacing is a spacer element (like TestimonialSingle) so the editor can drag it. */
.${P}-spacer {
  flex: 0 0 auto;
  width: 100%;
}
.${P}-control {
  position: relative;
  z-index: 2;
  pointer-events: auto;
}
.${P}-control::before {
  content: "";
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  pointer-events: auto;
  z-index: 10;
}
.${P}-question {
  margin: 0;
  padding: 0;
  text-align: var(--${P}-align);
  color: var(--${P}-question-color);
}
.${P}-answers {
  box-sizing: border-box;
  display: flex;
  flex-direction: column;
  width: var(--${P}-answer-width);
  max-width: 100%;
  align-self: var(--${P}-align-self);
}
/* Flex, not grid, so a short last row (an odd answer in 2 columns) sits centered. */
.${P}-answer-row {
  display: flex;
  justify-content: center;
  column-gap: var(--${P}-answer-gap);
}
.${P}-answer-row > .${P}-answer {
  flex: 0 0 auto;
  width: calc((100% - (var(--${P}-columns) - 1) * var(--${P}-answer-gap)) / var(--${P}-columns));
  min-width: 0;
}
.${P}-answer,
.${P}-submit {
  position: relative;
  isolation: isolate;
  box-sizing: border-box;
  border: var(--${P}-bw) solid transparent;
  background: none;
  transition: color var(--${P}-fade) ease, transform 0.15s ease;
}
.${P}-wrapper {
  --${P}-fade: 0.25s;
}
.${P}-interactive .${P}-answer:active,
.${P}-interactive .${P}-submit:active {
  transform: scale(0.97);
}
.${P}-layer,
.${P}-layer::before,
.${P}-answer::before,
.${P}-submit::before {
  position: absolute;
  inset: calc(-1 * var(--${P}-bw));
  box-sizing: border-box;
  border: var(--${P}-bw) solid transparent;
  border-radius: inherit;
  background-origin: border-box;
  background-clip: padding-box;
  pointer-events: none;
}
.${P}-layer {
  z-index: -2;
  transition: opacity var(--${P}-fade) ease;
}
.${P}-layer::before {
  content: "";
  background-color: var(--${P}-fill-color);
  background-image: var(--${P}-fill-image);
  background-size: 100% 100%;
  background-repeat: no-repeat;
}
.${P}-layer::after {
  content: "";
  position: absolute;
  inset: calc(-1 * var(--${P}-bw));
  box-sizing: border-box;
  padding: var(--${P}-bw);
  border-radius: inherit;
  background: var(--${P}-ring);
  -webkit-mask: linear-gradient(#000 0 0) content-box, linear-gradient(#000 0 0);
  -webkit-mask-composite: xor;
  mask: linear-gradient(#000 0 0) content-box exclude, linear-gradient(#000 0 0);
}
.${P}-answer::before,
.${P}-submit::before {
  content: "";
  z-index: -3;
  background-image: var(--${P}-texture);
  background-size: cover;
  background-repeat: no-repeat;
  background-position: center;
}
.${P}-layer-selected {
  --${P}-fill-color: var(--${P}-answer-selected-bg-color);
  --${P}-fill-image: var(--${P}-answer-selected-bg-image);
  --${P}-ring: var(--${P}-answer-selected-border-color);
  opacity: 0;
}
.${P}-answer-selected .${P}-layer {
  opacity: 0;
}
.${P}-answer-selected .${P}-layer-selected {
  opacity: 1;
}
@media (prefers-reduced-motion: reduce) {
  .${P}-wrapper {
    --${P}-fade: 0s;
  }
  .${P}-interactive .${P}-answer:active,
  .${P}-interactive .${P}-submit:active {
    transform: none;
  }
}
.${P}-answer {
  --${P}-bw: var(--${P}-answer-border-width);
  --${P}-fill-color: var(--${P}-answer-bg-color);
  --${P}-fill-image: var(--${P}-answer-bg-image);
  --${P}-ring: var(--${P}-answer-border-color);
  --${P}-texture: var(--${P}-answer-texture);
  display: flex;
  align-items: center;
  justify-content: var(--${P}-align-self);
  gap: var(--${P}-icon-gap);
  margin: 0;
  padding: var(--${P}-answer-padding);
  border-radius: var(--${P}-answer-radius);
  text-align: var(--${P}-align);
  text-decoration: none;
  font: inherit;
  color: var(--${P}-answer-color);
  cursor: default;
}
.${P}-interactive .${P}-answer {
  cursor: pointer;
}
.${P}-answer-selected {
  color: var(--${P}-answer-selected-color);
}
.${P}-answer-icon {
  flex: 0 0 auto;
  position: relative;
  width: var(--${P}-icon-size);
  height: var(--${P}-icon-size);
  --${P}-icon-fill: var(--${P}-icon-color);
}
.${P}-answer-icon-after {
  order: 1;
}
.${P}-answer-selected .${P}-answer-icon {
  --${P}-icon-fill: var(--${P}-icon-selected-color);
}
.${P}-answer-text {
  min-width: 0;
  overflow-wrap: break-word;
}
.${P}-submit {
  --${P}-bw: var(--${P}-button-border-width);
  --${P}-fill-color: var(--${P}-button-bg-color);
  --${P}-fill-image: var(--${P}-button-bg-image);
  --${P}-ring: var(--${P}-button-border-color);
  --${P}-texture: var(--${P}-button-texture);
  align-self: var(--${P}-align-self);
  max-width: 100%;
  margin: 0;
  padding: var(--${P}-button-padding, 0.6em 1.2em);
  border-radius: var(--${P}-button-radius);
  text-align: center;
  text-decoration: none;
  color: var(--${P}-button-text-color);
  cursor: default;
}
.${P}-submit-full {
  width: var(--${P}-answer-width);
}
.${P}-interactive .${P}-submit {
  cursor: pointer;
}
`;
}

function paddingToCss(padding: Padding, isEditor?: boolean): string {
  return [padding.top, padding.right, padding.bottom, padding.left]
    .map(side => scalingValue(side ?? 0, isEditor ?? false))
    .join(' ');
}

function resolveTextStyle(
  fontFamily: string | undefined,
  fontSettings: FontSettings | undefined,
  fontSize: number | undefined,
  lineHeight: number | undefined,
  letterSpacing: number | undefined,
  wordSpacing: number | undefined,
  textAppearance: TextStyles['textAppearance'],
): TextStyles {
  return {
    fontSettings: {
      fontFamily,
      fontWeight: fontSettings?.fontWeight ?? 400,
      fontStyle: fontSettings?.fontStyle ?? 'normal',
    },
    fontSize: fontSize ?? 0.01,
    lineHeight,
    letterSpacing: letterSpacing ?? 0,
    wordSpacing: wordSpacing ?? 0,
    textAppearance,
    color: 'inherit',
  };
}

function buildValidUrl(url: string): string {
  const prefixes = ['http://', 'https://', '/', 'mailto:', 'tel:', '#'];
  if (prefixes.some(prefix => url.startsWith(prefix))) return url;
  return `//${url}`;
}

function getUrlHref(link: SurveyLink): { href: string; target?: '_blank' } | undefined {
  if (link.type !== 'url') return undefined;
  return { href: buildValidUrl(link.value), ...(link.target === 'blank' ? { target: '_blank' as const } : {}) };
}

export function Survey({ settings, content, isEditor, isPreviewMode, isEditMode, activeEvent, onSubmit, getLinkHref, onNavigate }: SurveyProps) {
  const { prefix: P } = useScopedStyles();
  const {
    selectionCount = 'one',
    submitLabel = 'Submit',
    submitLink: link,
    questionGap = 0.0222,
    questionAnswersGap = 0.00833,
    answerGap = 0.00833,
    iconGap = 0.00833,
    buttonPaddingTop = 0.0222,
    answerPadding = { top: 0, right: 0, bottom: 0, left: 0 },
    buttonPadding,
    answerRadius = 0,
    buttonRadius = 0,
    answerBorderWidth = 0,
    buttonBorderWidth = 0,
    answerTexture,
    buttonTexture,
    align = 'left',
    answerWidth,
    answerColumns = '1',
    buttonWidth = 'auto',
    iconSize = 0.01388,
    questionColor = '#000000',
    answerColor = '#000000',
    answerSelectedColor = '#A60239',
    answerBgColor = '#FFFFFF00',
    answerSelectedBgColor = '#FFFFFF00',
    answerBorderColor = '#000000',
    answerSelectedBorderColor = '#A60239',
    iconColor = '#000000',
    iconSelectedColor = '#A60239',
    buttonColor = '#000000',
    buttonTextColor = '#FFFFFF',
    buttonBorderColor = '#000000',
    questionFontFamily,
    questionFontSettings,
    questionFontSize,
    questionLineHeight,
    questionLetterSpacing,
    questionWordSpacing,
    questionTextAppearance,
    answerFontFamily,
    answerFontSettings,
    answerFontSize,
    answerLineHeight,
    answerLetterSpacing,
    answerWordSpacing,
    answerTextAppearance,
    buttonFontFamily,
    buttonFontSettings,
    buttonFontSize,
    buttonLineHeight,
    buttonLetterSpacing,
    buttonWordSpacing,
    buttonTextAppearance,
  } = settings;
  const items = content ?? [];
  const columns = Math.min(2, Math.max(1, Math.floor(Number(answerColumns)) || 1));
  const isInteractive = !isEditor || isPreviewMode;
  const showControls = isEditMode ?? false;

  const spacer = (setting: SpacingSetting, value: number, withControl: boolean, key?: string) => (
    <div
      key={key}
      aria-hidden
      data-controls={showControls && withControl ? setting : undefined}
      className={cn(`${P}-spacer`, showControls && withControl && `${P}-control`)}
      style={{ height: scalingValue(value, isEditor ?? false) }}
    />
  );
  const [selected, setSelected] = useState<SurveyAnswers>(() => items.map(() => []));

  useEffect(() => {
    setSelected(items.map(() => []));
  }, [items.length, selectionCount]);

  const toggleAnswer = (questionIndex: number, answerIndex: number) => {
    if (!isInteractive) return;
    setSelected((prev) => {
      const next = items.map((_, i) => prev[i] ?? []);
      const current = next[questionIndex];
      if (selectionCount === 'one') {
        next[questionIndex] = current.includes(answerIndex) ? [] : [answerIndex];
      } else {
        next[questionIndex] = current.includes(answerIndex)
          ? current.filter(i => i !== answerIndex)
          : [...current, answerIndex];
      }
      return next;
    });
  };

  const isComplete = items.every((item, i) => (item.answers?.length ?? 0) === 0 || (selected[i]?.length ?? 0) > 0);
  const linkHref = !isEditor && link?.value
    ? (getLinkHref ? getLinkHref(link) : getUrlHref(link))
    : undefined;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!isInteractive || !isComplete) return;
    onSubmit?.(selected);
    if (!isEditor && link?.type === 'scene' && link.value) onNavigate?.(link);
  };

  const handleLinkClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
    if (!isComplete) {
      e.preventDefault();
      return;
    }
    onSubmit?.(selected);
  };

  const questionTypographyCss = omitTextColors(textStylesToCss(
    resolveTextStyle(
      questionFontFamily,
      questionFontSettings,
      questionFontSize,
      questionLineHeight,
      questionLetterSpacing,
      questionWordSpacing,
      questionTextAppearance,
    ),
    isEditor,
  ));
  const answerTypographyCss = omitTextColors(textStylesToCss(
    resolveTextStyle(
      answerFontFamily,
      answerFontSettings,
      answerFontSize,
      answerLineHeight,
      answerLetterSpacing,
      answerWordSpacing,
      answerTextAppearance,
    ),
    isEditor,
  ));
  const buttonTypographyCss = omitTextColors(textStylesToCss(
    resolveTextStyle(
      buttonFontFamily,
      buttonFontSettings,
      buttonFontSize,
      buttonLineHeight,
      buttonLetterSpacing,
      buttonWordSpacing,
      buttonTextAppearance,
    ),
    isEditor,
  ));

  const colorVars = {
    ...buildColorVars(P, {
      questionColor,
      answerColor,
      answerSelectedColor,
      iconColor,
      iconSelectedColor,
      buttonTextColor,
      answerBorderColor,
      answerSelectedBorderColor,
      buttonBorderColor,
    }, COLOR_VAR_MAP, STATE_KEYS),
    ...fillVars(P, 'answer-bg', answerBgColor),
    ...fillVars(P, 'answer-selected-bg', answerSelectedBgColor),
    ...fillVars(P, 'button-bg', buttonColor),
    ...textureVars(P, 'answer', answerTexture),
    ...textureVars(P, 'button', buttonTexture),
  } as React.CSSProperties;

  const stateClass = activeEvent && activeEvent !== 'default' ? `${P}-state-${activeEvent}` : '';
  const scopedCss = useMemo(() => getCSS(P), [P]);
  const wrapperStyleVars = {
    [`--${P}-icon-gap`]: scalingValue(iconGap, isEditor ?? false),
    [`--${P}-answer-gap`]: scalingValue(answerGap, isEditor ?? false),
    [`--${P}-columns`]: String(columns),
    [`--${P}-answer-padding`]: paddingToCss(answerPadding, isEditor),
    ...(buttonPadding ? { [`--${P}-button-padding`]: paddingToCss(buttonPadding, isEditor) } : {}),
    [`--${P}-answer-radius`]: scalingValue(answerRadius, isEditor ?? false),
    [`--${P}-button-radius`]: scalingValue(buttonRadius, isEditor ?? false),
    [`--${P}-answer-border-width`]: scalingValue(answerBorderWidth, isEditor ?? false),
    [`--${P}-button-border-width`]: scalingValue(buttonBorderWidth, isEditor ?? false),
    [`--${P}-align`]: align,
    [`--${P}-align-self`]: FLEX_ALIGN[align],
    [`--${P}-answer-width`]: answerWidth !== undefined ? scalingValue(answerWidth, isEditor ?? false) : '100%',
    [`--${P}-icon-size`]: scalingValue(iconSize, isEditor ?? false),
  } as React.CSSProperties;

  return (
    <>
      <style dangerouslySetInnerHTML={{ __html: scopedCss }} />
      <div style={colorVars}>
        <form
          className={cn(`${P}-wrapper`, isInteractive && `${P}-interactive`, stateClass)}
          style={wrapperStyleVars}
          onSubmit={handleSubmit}
          noValidate
        >
          {items.map((item, questionIndex) => {
            const answers = item.answers ?? [];
            const selectedAnswers = selected[questionIndex] ?? [];
            const questionId = `${P}-question-${questionIndex}`;
            return (
              <div key={questionIndex} className={`${P}-question-block`}>
                {questionIndex > 0 && spacer('questionGap', questionGap, questionIndex === 1)}
                {item.question && (
                  <p id={questionId} className={`${P}-question`} style={questionTypographyCss}>
                    {item.question}
                  </p>
                )}
                {item.question && spacer('questionAnswersGap', questionAnswersGap, questionIndex === 0)}
                <div
                  className={`${P}-answers`}
                  role="group"
                  aria-labelledby={item.question ? questionId : undefined}
                >
                  {Array.from({ length: Math.ceil(answers.length / columns) }, (_, rowIndex) => [
                    rowIndex > 0 && spacer('answerGap', answerGap, questionIndex === 0 && rowIndex === 1, `gap-${rowIndex}`),
                    <div key={rowIndex} className={`${P}-answer-row`}>
                      {answers.slice(rowIndex * columns, (rowIndex + 1) * columns).map((answer, indexInRow) => {
                        const answerIndex = rowIndex * columns + indexInRow;
                        const isSelected = selectedAnswers.includes(answerIndex);
                        const iconUrl = answer.icon?.url;
                        return (
                          <a
                            key={answerIndex}
                            role="button"
                            data-selected={isSelected ? 'true' : 'false'}
                            data-label={answer.text ?? ''}
                            aria-pressed={isSelected}
                            tabIndex={isInteractive ? 0 : -1}
                            className={cn(`${P}-answer`, isSelected && `${P}-answer-selected`)}
                            style={answerTypographyCss}
                            onClick={() => toggleAnswer(questionIndex, answerIndex)}
                            onKeyDown={(e) => {
                              // An <a> without href doesn't activate on Enter/Space by itself.
                              if (e.key !== 'Enter' && e.key !== ' ') return;
                              e.preventDefault();
                              toggleAnswer(questionIndex, answerIndex);
                            }}
                          >
                            <span aria-hidden className={`${P}-layer`} />
                            <span aria-hidden className={cn(`${P}-layer`, `${P}-layer-selected`)} />
                            {iconUrl && (
                              <span className={cn(`${P}-answer-icon`, answer.iconPosition === 'after' && `${P}-answer-icon-after`)}>
                                <SvgImage
                                  url={iconUrl}
                                  fill={`var(--${P}-icon-fill)`}
                                  hoverFill={`var(--${P}-icon-fill)`}
                                />
                              </span>
                            )}
                            {answer.text && <span className={`${P}-answer-text`}>{answer.text}</span>}
                          </a>
                        );
                      })}
                    </div>,
                  ])}
                </div>
              </div>
            );
          })}
          {spacer('buttonPaddingTop', buttonPaddingTop, true)}
          {linkHref ? (
            <a
              href={linkHref.href}
              target={linkHref.target}
              rel={linkHref.target === '_blank' ? 'noreferrer' : undefined}
              className={cn(`${P}-submit`, buttonWidth === 'full' && `${P}-submit-full`)}
              style={buttonTypographyCss}
              onClick={handleLinkClick}
            >
              <span aria-hidden className={`${P}-layer`} />
              {submitLabel}
            </a>
          ) : (
            <button
              type="submit"
              className={cn(`${P}-submit`, buttonWidth === 'full' && `${P}-submit-full`)}
              style={buttonTypographyCss}
              tabIndex={isInteractive ? undefined : -1}
            >
              <span aria-hidden className={`${P}-layer`} />
              {submitLabel}
            </button>
          )}
        </form>
      </div>
    </>
  );
}
