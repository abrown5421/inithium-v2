import * as React from 'react';
import { PageLayoutComponent } from '@inithium/pages';
import { 
  Accordion, 
  AccordionItem, 
  AccordionTrigger, 
  AccordionContent,
  Heading,
  ScrollArea,
  Button,
  Sheet,
  SheetTrigger,
  SheetContent,
  SheetHeader,
  SheetTitle
} from '@inithium/ui';
import { Menu } from 'lucide-react';
import { DOCS_CONFIG } from './documentation-page.schema.js';
import { Topic, SubTopic, ActiveLocation, TopicOverviewDisplayProps, SubTopicDetailDisplayProps } from './documentation-page.types.js';

const findTopicById = (topics: readonly Topic[], id: string): Topic | undefined =>
  topics.find((topic) => topic.id === id);

const findSubTopicRecursive = (
  subTopics: readonly SubTopic[] | undefined,
  id: string
): SubTopic | undefined => {
  if (!subTopics || subTopics.length === 0) return undefined;

  return subTopics.reduce<SubTopic | undefined>((found, subTopic) => {
    if (found) return found;
    if (subTopic.id === id) return subTopic;
    return findSubTopicRecursive(subTopic.subTopics, id);
  }, undefined);
};

const resolveActiveTopic = (topics: readonly Topic[], location: ActiveLocation): Topic | undefined =>
  findTopicById(topics, location.topicId) ?? topics[0];

const resolveActiveSubTopic = (
  topic: Topic | undefined,
  location: ActiveLocation
): SubTopic | undefined =>
  location.type === 'subTopic' && topic
    ? findSubTopicRecursive(topic.subTopics, location.subTopicId)
    : undefined;

interface SubTopicNavListProps {
  readonly topicId: string;
  readonly subTopics: readonly SubTopic[];
  readonly activeLocation: ActiveLocation;
  readonly depth?: number;
  readonly onSelectSubTopic: (topicId: string, subTopicId: string) => void;
}

const SubTopicNavList: React.FC<SubTopicNavListProps> = ({
  topicId,
  subTopics,
  activeLocation,
  depth = 0,
  onSelectSubTopic,
}) => (
  <nav className={`flex flex-col gap-1 ${depth > 0 ? 'pl-3 border-l border-border/50 my-1' : 'pl-2'}`}>
    {subTopics.map((subTopic) => {
      const isActive =
        activeLocation.type === 'subTopic' &&
        activeLocation.topicId === topicId &&
        activeLocation.subTopicId === subTopic.id;

      return (
        <React.Fragment key={subTopic.id}>
          <Button
            variant='ghost'
            size="sm"
            className={`justify-start font-normal ${
              isActive ? 'font-medium text-foreground' : 'text-muted-foreground hover:text-foreground'
            }`}
            onClick={() => onSelectSubTopic(topicId, subTopic.id)}
          >
            {subTopic.title}
          </Button>

          {subTopic.subTopics && subTopic.subTopics.length > 0 && (
            <SubTopicNavList
              topicId={topicId}
              subTopics={subTopic.subTopics}
              activeLocation={activeLocation}
              depth={depth + 1}
              onSelectSubTopic={onSelectSubTopic}
            />
          )}
        </React.Fragment>
      );
    })}
  </nav>
);

const TopicOverviewDisplay: React.FC<TopicOverviewDisplayProps> = ({ topic, onSelectSubTopic }) => (
  <section className="flex flex-col gap-6 pb-24">
    <Heading font="secondary" level={1}>
      {topic.title}
    </Heading>

    {topic.overviewContent ?? (
      <p className="text-sm text-muted-foreground">
        Welcome to the {topic.title} section. Select a subtopic from below or the sidebar to view documentation.
      </p>
    )}
  </section>
);

const SubTopicDetailDisplay: React.FC<SubTopicDetailDisplayProps> = ({ subTopic }) => (
  <section className="flex flex-col gap-6 pb-24">
    <div className="rounded-lg border border-border p-4 md:p-6 shadow-sm">
      <Heading font="secondary" level={2} className="mb-4">
        {subTopic.title}
      </Heading>
      {subTopic.content ?? (
        <p className="text-sm text-muted-foreground">
          Documentation content for {subTopic.title} goes here.
        </p>
      )}
    </div>
  </section>
);

export const DocumentationPage: PageLayoutComponent = () => {
  const [activeLocation, setActiveLocation] = React.useState<ActiveLocation>({
    type: 'topic',
    topicId: DOCS_CONFIG[0]?.id ?? 'overview',
  });

  const [expandedTopics, setExpandedTopics] = React.useState<readonly string[]>([
    DOCS_CONFIG[0]?.id ?? 'overview',
  ]);

  const [isMobileMenuOpen, setIsMobileMenuOpen] = React.useState<boolean>(false);

  const activeTopic = React.useMemo(
    () => resolveActiveTopic(DOCS_CONFIG, activeLocation),
    [activeLocation]
  );

  const activeSubTopic = React.useMemo(
    () => resolveActiveSubTopic(activeTopic, activeLocation),
    [activeTopic, activeLocation]
  );

  const handleTopicClick = (topicId: string) => {
    setIsMobileMenuOpen(false);

    if (activeLocation.topicId === topicId) {
      if (activeLocation.type === 'subTopic') {
        setActiveLocation({ type: 'topic', topicId });
        setExpandedTopics((prev) =>
          prev.includes(topicId) ? prev : [...prev, topicId]
        );
      } else {
        setExpandedTopics((prev) =>
          prev.includes(topicId) ? prev.filter((id) => id !== topicId) : [...prev, topicId]
        );
      }
    } else {
      setActiveLocation({ type: 'topic', topicId });
      setExpandedTopics((prev) =>
        prev.includes(topicId) ? prev : [...prev, topicId]
      );
    }
  };

  const handleSubTopicClick = (topicId: string, subTopicId: string) => {
    setIsMobileMenuOpen(false);
    setActiveLocation({ type: 'subTopic', topicId, subTopicId });
    setExpandedTopics((prev) =>
      prev.includes(topicId) ? prev : [...prev, topicId]
    );
  };

  const renderNavigationContent = () => (
    <Accordion
      type="multiple"
      value={[...expandedTopics]}
      onValueChange={(values) => setExpandedTopics(values)}
    >
      {DOCS_CONFIG.map((topic) => (
        <AccordionItem key={topic.id} value={topic.id}>
          <AccordionTrigger onClick={() => handleTopicClick(topic.id)}>
            {topic.title}
          </AccordionTrigger>
          <AccordionContent>
            <SubTopicNavList
              topicId={topic.id}
              subTopics={topic.subTopics}
              activeLocation={activeLocation}
              onSelectSubTopic={handleSubTopicClick}
            />
          </AccordionContent>
        </AccordionItem>
      ))}
    </Accordion>
  );

  return (
    <div className="mx-auto flex h-[calc(100vh-4rem)] w-full flex-col md:flex-row gap-4 md:gap-8 p-4 overflow-hidden">
      <div className="flex md:hidden items-center justify-between border-b border-border pb-3">
        <Heading font="secondary" level={3}>
          {activeSubTopic ? activeSubTopic.title : activeTopic?.title}
        </Heading>

        <Sheet open={isMobileMenuOpen} onOpenChange={setIsMobileMenuOpen}>
          <SheetTrigger asChild>
            <Button variant="ghost" size="sm" className="flex items-center gap-2">
              <Menu className="size-4" />
              <span>Topics</span>
            </Button>
          </SheetTrigger>
          <SheetContent side="left" className="w-80 p-4">
            <SheetHeader className="mb-4 text-left">
              <SheetTitle>Documentation</SheetTitle>
            </SheetHeader>
            <ScrollArea className="h-[calc(100vh-8rem)] pr-2">
              {renderNavigationContent()}
            </ScrollArea>
          </SheetContent>
        </Sheet>
      </div>

      <aside className="hidden md:block w-64 shrink-0 overflow-y-auto pr-2 border-r border-border">
        {renderNavigationContent()}
      </aside>

      <main className="flex-1 overflow-hidden">
        <ScrollArea className="h-full pr-2 md:pr-4">
          {activeLocation.type === 'subTopic' && activeSubTopic ? (
            <SubTopicDetailDisplay subTopic={activeSubTopic} />
          ) : (
            activeTopic && (
              <TopicOverviewDisplay
                topic={activeTopic}
                onSelectSubTopic={handleSubTopicClick}
              />
            )
          )}
        </ScrollArea>
      </main>
    </div>
  );
};