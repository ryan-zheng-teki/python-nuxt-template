import { library, config } from '@fortawesome/fontawesome-svg-core'
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'
import {
  faChevronRight,
  faChevronLeft,
  faFolder,
  faPaperPlane,
  faPlus,
  faFileExport,
  faRocket,
  faHistory,
  faBook,
  faBookOpen,
  faFileAlt,
  faEdit,
  faArrowLeft,
  faArrowRight,
  faFolderOpen,
  faTimes,
  faFile,
  faFileCode,
  faSearch,
  faMicrophone,
  faSync,
  faVial,
  faSave,
  faShare,
  faCode,
  faPlay, // Already exists, good for 'normal' speed
  faSitemap,
  faCheck,
  faClipboardList,
  faDraftingCompass,
  faExternalLinkAlt,
  faRobot,
  faTasks,
  faBackward, // Add for 'slow' speed
  faForward, // Add for 'fast' speed
  faAtom // Add for visual flair maybe
} from '@fortawesome/free-solid-svg-icons'

// This is important, otherwise the icons won't appear
config.autoAddCss = false

export default defineNuxtPlugin(nuxtApp => {
  // Add all icons to the library
  library.add(
    faChevronRight,
    faChevronLeft,
    faFolder,
    faPaperPlane,
    faPlus,
    faFileExport,
    faRocket,
    faHistory,
    faBook,
    faBookOpen,
    faFileAlt,
    faEdit,
    faArrowLeft,
    faArrowRight,
    faFolderOpen,
    faTimes,
    faFile,
    faFileCode,
    faSearch,
    faMicrophone,
    faSync,
    faVial,
    faSave,
    faShare,
    faCode,
    faPlay,
    faSitemap,
    faCheck,
    faClipboardList,
    faDraftingCompass,
    faExternalLinkAlt,
    faRobot,
    faTasks,
    faBackward, // Added
    faForward,  // Added
    faAtom      // Added
  )

  // Register the FontAwesomeIcon component globally
  nuxtApp.vueApp.component('FontAwesomeIcon', FontAwesomeIcon)
  console.log('FontAwesome plugin configured with additional icons.');
})
