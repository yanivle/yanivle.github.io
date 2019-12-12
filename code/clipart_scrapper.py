# import urlparse
import scrapy

from scrapy.http import Request

TERM = 'cartoon'


class PublicDomainVectorsSpider(scrapy.Spider):
  name = 'publicdomainvectors_spider'
  start_urls = ['https://publicdomainvectors.org/en/search/' + TERM]

  def parse(self, response):
    VECTOR_SELECTOR = '.vector-thumbnail ::attr(src)'
    for url in response.css(VECTOR_SELECTOR).extract():
      yield Request(url=response.urljoin(url), callback=self.save_image)

    NEXT_SELECTOR = 'li.next a ::attr(href)'
    next = response.css(NEXT_SELECTOR).extract_first()
    if next:
      yield Request(url=response.urljoin(next), callback=self.parse)

  def save_image(self, response):
    path = response.url.split('/')[-1]
    self.logger.info('Saving image %s', path)
    with open('scrapped_cliparts/' + TERM + '/' + path, 'wb') as f:
      f.write(response.body)
