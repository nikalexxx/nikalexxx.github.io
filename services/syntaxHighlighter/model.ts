export interface RuleCaptureConfig<T> {
    name: string;
    patterns: T[];
}

export interface RuleCapturesConfig<T> {
    [name: string]: RuleCaptureConfig<T>;
    [index: number]: RuleCaptureConfig<T>;
}

/* #region  raw rule config types */

export type LevelConfig = {
    patterns?: RuleConfig[];
    repository?: RepositoryConfig;
};

export type RepositoryConfig = {
    [name: string]: RuleConfig | LevelConfig;
};

export type RuleConfigType<T> = {
    comment?: string;
    disabled?: boolean;
} & T;

export type RuleConfig = RuleConfigType<
    RuleIncludeConfig | RuleMathConfig | RuleBeginConfig
>;

export type RuleIncludeConfig = {
    include: string;
};

export type RuleMathConfig = {
    match: string;
    name?: string;
    captures?: RuleCapturesConfig<RuleConfig>;
};

export type RuleBeginConfigType<T> = {
    begin: string;
    name?: string;
    beginCaptures?: RuleCapturesConfig<RuleConfig>;
    captures?: RuleCapturesConfig<RuleConfig>;
} & T;

export type RuleBeginConfig = {
    begin: string;
    name?: string;
    beginCaptures?: RuleCapturesConfig<RuleConfig>;
    captures?: RuleCapturesConfig<RuleConfig>;
} & (RuleEndConfig | RuleWhileConfig);

export type RuleEndConfig = {
    end: string;
    contentName?: string;
    patterns?: RuleConfig[];
    endCaptures?: RuleCapturesConfig<RuleConfig>;
};

export type RuleWhileConfig = {
    while: string;
    whileCaptures?: RuleCapturesConfig<RuleConfig>;
};

/* #endregion */

export enum RuleType {
    INCLUDE,
    BEGIN_END,
    BEGIN_WHILE,
    MATCH,
}

export type RuleGenType<T> = {
    comment?: string;
    disabled?: boolean;
    type: RuleType;
} & T;

export type Rule = RuleGenType<RuleIncludeFields | RuleMathFields | RuleBeginFields>;

/**
 * @from_type RuleIncludeConfig
 */
export type RuleIncludeFields = {
    include: string;
};

/**
 * @from_type RuleMathConfig
 */
export type RuleMathFields = {
    match: string;
    name?: string;
    captures?: RuleCapturesConfig<Rule>;
};

export type RuleBeginFieldsType<T> = {
    begin: string;
    name?: string;
    beginCaptures?: RuleCapturesConfig<Rule>;
    captures?: RuleCapturesConfig<Rule>;
} & T;

/**
 * @from_type RuleBeginConfig
 */
export type RuleBeginFields = {
    begin: string;
    name?: string;
    beginCaptures?: RuleCapturesConfig<Rule>;
    captures?: RuleCapturesConfig<Rule>;
} & (RuleEndFields | RuleWhileFields);

export type RuleEndFields = {
    end: string;
    contentName?: string;
    patterns?: Rule[];
    endCaptures?: RuleCapturesConfig<Rule>;
};

/**
 * @from_type RuleWhileConfig
 */
export type RuleWhileFields = {
    while: string;
    whileCaptures?: RuleCapturesConfig<Rule>;
};


export interface CaptureGroups {
    [groupName: string]: [number, number];
}

type Label = string; // имя лейбла, определяется грамматикой
type TokenGroup = number; // группа для несвязанных частей текста, 0 — без группы
type Token = [Label, RichText[], TokenGroup];

// неразмеченный текст либо токен
export type RichText = string | Token;

export type RichLines = RichText[][]; // строки из несвязанных кусков

/*
    ruleList: Rule[];
превращается:
['line', [
    '    ',
    ['key', 'ruleList', 0],
    ': ',
    ['typeName', 'Rule', 0],
    '[];'
], 0]
пример, как это может выглядеть в html:
<pre>
    <span class="js.line">
        <span>    </span>
        <span class="js.key">ruleList</span>
        <span>: </span>
        <span class="js.typeName">Rule</span>
        <span>[];</span>
    </span>
</pre>
*/
