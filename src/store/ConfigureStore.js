//Определяем, как создать Хранилище - в рабочей среде или для разработки
import {__PRODUCTION__} from 'environs';
import prodStore from './ConfigureStore.prod';
import devStore from './ConfigureStore.dev';
export default __PRODUCTION__ ? prodStore : devStore;