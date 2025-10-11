declare module 'single-spa-vue' {
  import { App } from 'vue';
  
  export interface SingleSpaVueOptions {
    Vue?: any;
    appOptions?: any;
    loadRootComponent?: () => Promise<any> | any;
    handleInstance?: (app: App, props: any) => void;
    [key: string]: any;
  }
  
  export default function singleSpaVue(options: SingleSpaVueOptions): {
    mount: (props: any) => Promise<any>;
    unmount: (props: any) => Promise<any>;
    bootstrap?: (props: any) => Promise<any>;
    update?: (props: any) => Promise<any>;
  };
}