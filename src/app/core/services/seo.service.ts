import { DOCUMENT } from '@angular/common';
import { inject, Injectable } from '@angular/core';
import { Meta, Title } from '@angular/platform-browser';

/**
 * Configuração de SEO para uma página
 */
export interface SeoConfig {
  title?: string;
  description?: string;
  keywords?: string;
  image?: string;
  url?: string;
  type?: 'website' | 'article' | 'product';
  author?: string;
  publishedTime?: string;
  modifiedTime?: string;
}

/**
 * Serviço para gerenciar SEO (Meta tags, Open Graph, Twitter Cards)
 * Essencial para e-commerce ranquear bem no Google
 */
@Injectable({
  providedIn: 'root',
})
export class SeoService {
  private readonly title = inject(Title);
  private readonly meta = inject(Meta);
  private readonly document = inject(DOCUMENT);

  private readonly defaultConfig: SeoConfig = {
    title: 'Coffee Workshop - Premium Coffee & Equipment',
    description: 'Shop premium coffee beans and professional equipment',
    keywords: 'coffee, espresso, coffee beans, coffee equipment',
    type: 'website',
  };

  /**
   * Configura SEO da página
   */
  updateSeo(config: SeoConfig): void {
    const seoConfig = { ...this.defaultConfig, ...config };

    // Title
    if (seoConfig.title) {
      this.title.setTitle(seoConfig.title);
    }

    // Meta tags básicas
    this.updateMetaTag('description', seoConfig.description);
    this.updateMetaTag('keywords', seoConfig.keywords);
    this.updateMetaTag('author', seoConfig.author);

    // Open Graph (Facebook, LinkedIn)
    this.updateMetaTag('og:title', seoConfig.title, 'property');
    this.updateMetaTag('og:description', seoConfig.description, 'property');
    this.updateMetaTag('og:image', seoConfig.image, 'property');
    this.updateMetaTag('og:url', seoConfig.url, 'property');
    this.updateMetaTag('og:type', seoConfig.type, 'property');

    // Twitter Cards
    this.updateMetaTag('twitter:card', 'summary_large_image', 'name');
    this.updateMetaTag('twitter:title', seoConfig.title, 'name');
    this.updateMetaTag('twitter:description', seoConfig.description, 'name');
    this.updateMetaTag('twitter:image', seoConfig.image, 'name');

    // Article meta tags
    if (seoConfig.type === 'article') {
      this.updateMetaTag('article:published_time', seoConfig.publishedTime, 'property');
      this.updateMetaTag('article:modified_time', seoConfig.modifiedTime, 'property');
      this.updateMetaTag('article:author', seoConfig.author, 'property');
    }

    // Product meta tags (para e-commerce)
    if (seoConfig.type === 'product') {
      this.updateMetaTag('og:type', 'product', 'property');
    }
  }

  /**
   * Atualiza ou cria meta tag
   */
  private updateMetaTag(
    name: string,
    content: string | undefined,
    attribute: 'name' | 'property' = 'name',
  ): void {
    if (!content) return;

    const selector = `${attribute}="${name}"`;
    const existingTag = this.meta.getTag(selector);

    if (existingTag) {
      this.meta.updateTag({ [attribute]: name, content });
    } else {
      this.meta.addTag({ [attribute]: name, content });
    }
  }

  /**
   * Adiciona canonical URL (importante para SEO)
   */
  setCanonicalUrl(url?: string): void {
    const canonicalUrl = url || this.document.URL;
    let link: HTMLLinkElement | null = this.document.querySelector('link[rel="canonical"]');

    if (!link) {
      link = this.document.createElement('link');
      link.setAttribute('rel', 'canonical');
      this.document.head.appendChild(link);
    }

    link.setAttribute('href', canonicalUrl);
  }

  /**
   * Adiciona structured data (JSON-LD) para rich snippets
   */
  addStructuredData(data: Record<string, unknown>): void {
    let script: HTMLScriptElement | null = this.document.querySelector(
      'script[type="application/ld+json"]',
    );

    if (!script) {
      script = this.document.createElement('script');
      script.type = 'application/ld+json';
      this.document.head.appendChild(script);
    }

    script.textContent = JSON.stringify(data);
  }

  /**
   * Structured data para produto (e-commerce)
   */
  addProductStructuredData(product: {
    name: string;
    description: string;
    image: string;
    price: number;
    currency: string;
    availability: 'InStock' | 'OutOfStock';
    rating?: number;
    reviewCount?: number;
  }): void {
    const structuredData = {
      '@context': 'https://schema.org',
      '@type': 'Product',
      name: product.name,
      description: product.description,
      image: product.image,
      offers: {
        '@type': 'Offer',
        price: product.price,
        priceCurrency: product.currency,
        availability: `https://schema.org/${product.availability}`,
      },
    };

    if (product.rating && product.reviewCount) {
      Object.assign(structuredData, {
        aggregateRating: {
          '@type': 'AggregateRating',
          ratingValue: product.rating,
          reviewCount: product.reviewCount,
        },
      });
    }

    this.addStructuredData(structuredData);
  }

  /**
   * Remove todas as meta tags customizadas
   */
  clearSeo(): void {
    this.title.setTitle(this.defaultConfig.title!);
    // Remove meta tags específicas se necessário
  }
}
