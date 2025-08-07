import GalleryCard from "./GalleryCard";
import * as genieIcons from "../../assets/genieIcons";
import { GALLERY_PROMPT } from "../../constant/textConstants";

const PROMPT_TEMPLATES = GALLERY_PROMPT.PROMPT_TEMPLATES;
const TOP_TEMPLATES = GALLERY_PROMPT.TABS.TOP_TEMPLATES;
const MY_TEMPLATES = GALLERY_PROMPT.TABS.MY_TEMPLATES;
const FAVORITE_PROMPTS = GALLERY_PROMPT.TABS.FAVORITE_PROMPTS;
const FavPrompts = genieIcons?.myPrompts;
const promptsTemplates = genieIcons?.promptsTemplates;
const topPrompts = genieIcons?.topPrompts;

export const tabData = (
  cardData,
  handlePromptClick,
  setGeniePages,
  onBookmarkUpdate
) => [
  {
    id: 0,
    text: MY_TEMPLATES,
    image: promptsTemplates,
    component: () => (
      <GalleryCard
        cardData={cardData}
        handlePromptClick={handlePromptClick}
        setGeniePages={setGeniePages}
        selectedTab={MY_TEMPLATES}
        onBookmarkUpdate={onBookmarkUpdate}
      />
    ),
  },
  {
    id: 1,
    text: TOP_TEMPLATES,
    image: topPrompts,
    component: () => (
      <GalleryCard
        cardData={cardData}
        handlePromptClick={handlePromptClick}
        setGeniePages={setGeniePages}
        selectedTab={TOP_TEMPLATES}
        onBookmarkUpdate={onBookmarkUpdate}
      />
    ),
  },
  {
    id: 2,
    text: FAVORITE_PROMPTS,
    image: FavPrompts,
    component: () => (
      <GalleryCard
        cardData={cardData}
        handlePromptClick={handlePromptClick}
        setGeniePages={setGeniePages}
        selectedTab={FAVORITE_PROMPTS}
        onBookmarkUpdate={onBookmarkUpdate}
      />
    ),
  },
];
