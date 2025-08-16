import { EnvironmentProviders, Provider, inject, provideAppInitializer } from "@angular/core";
import { TranslateService } from "@ngx-translate/core";

export function initializeAppLanguage(translateService: TranslateService): () => Promise<any> {
    return () => new Promise<void>((resolve, reject) => {
        translateService.addLangs(['pt', 'en', 'es', 'fr']);
        translateService.setDefaultLang('en');

        const preferredLang = localStorage.getItem('preferredLang');
        const browserLangFull = translateService.getBrowserLang();
        const browserLang = browserLangFull ? browserLangFull.substring(0, 2) : undefined;
        const defaultAppLang = 'en';
        let langToUse: string;

        if (preferredLang && translateService.getLangs().includes(preferredLang)) {
            langToUse = preferredLang;
        } else if (browserLang && translateService.getLangs().includes(browserLang)) {
            langToUse = browserLang;
        } else {
            langToUse = defaultAppLang;
        }

        console.log(`Usando idioma: ${langToUse}`);
        translateService.use(langToUse).subscribe({
            next: () => {
                console.log(`Idioma "${langToUse}" carregado.`);
                resolve();
            },
            error: (err) => {
                console.error(`Erro ao carregar idioma "${langToUse}":`, err);
                resolve();
            }
        });
    });
}

export const I18nInitializerProvider: Provider | EnvironmentProviders =
    provideAppInitializer(() => {
        const initializerFn = (initializeAppLanguage)(inject(TranslateService));
        return initializerFn();
    });