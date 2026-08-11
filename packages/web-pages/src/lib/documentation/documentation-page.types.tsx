import * as React from 'react';

export interface SubTopic {
  readonly id: string;
  readonly title: string;
  readonly content?: React.ReactNode;
  readonly subTopics?: readonly SubTopic[];
}

export interface Topic {
  readonly id: string;
  readonly title: string;
  readonly overviewContent?: React.ReactNode;
  readonly subTopics: readonly SubTopic[];
}

export type ActiveLocation = 
  | { readonly type: 'topic'; readonly topicId: string }
  | { readonly type: 'subTopic'; readonly topicId: string; readonly subTopicId: string };

export interface TopicOverviewDisplayProps {
    readonly topic: Topic;
    readonly onSelectSubTopic: (topicId: string, subTopicId: string) => void;
}

export interface SubTopicDetailDisplayProps {
    readonly subTopic: SubTopic;
}