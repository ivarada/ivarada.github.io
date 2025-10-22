# A Jekyll post_render hook that sets target="_blank" and rel="noopener noreferrer"
# on external links. Requires nokogiri in your build environment.
#
# Place this file at: _plugins/external_links.rb

require 'uri'
begin
  require 'nokogiri'
rescue LoadError
  Jekyll.logger.warn "external_links:", "nokogiri not available; external links plugin will be skipped."
end

module Jekyll
  class ExternalLinkProcessor
    def initialize(site)
      @site = site
      # Try to determine the site's host from site.url (may be nil)
      @site_host = begin
        u = site.config['url']
        URI.parse(u).host if u && !u.empty?
      rescue
        nil
      end
    end

    def external_host?(href)
      return false if href.nil? || href.empty?
      # ignore anchors, mailto, javascript:
      return false if href.start_with?('#') || href.start_with?('mailto:') || href.start_with?('javascript:')
      begin
        uri = URI.parse(href)
        # handle protocol-relative URLs
        if uri.scheme.nil? && href.start_with?('//')
          uri = URI.parse("http:#{href}")
        end
      rescue
        return false
      end
      return false if uri.host.nil?
      # If site_host is known, consider same-host (and subdomains of site host) internal
      if @site_host
        return !(uri.host == @site_host || uri.host.end_with?(".#{@site_host}"))
      end
      # Default: treat absolute (has host) links as external
      true
    end

    def process_output(doc)
      return if doc.output.nil? || doc.output.empty?
      return unless defined?(Nokogiri)
      # Only parse HTML-like output
      return unless doc.output_ext == '.html' || doc.output.include?('</a>')
      frag = Nokogiri::HTML::DocumentFragment.parse(doc.output)
      frag.css('a[href]').each do |a|
        href = a['href']
        next unless external_host?(href)
        # Set target
        a.set_attribute('target', '_blank') unless a['target'] == '_blank'
        # Add rel values preserving existing rel values
        existing = a['rel'].to_s.split(/\s+/)
        rel_vals = (existing + ['noopener', 'noreferrer']).uniq
        a.set_attribute('rel', rel_vals.join(' '))
      end
      doc.output = frag.to_html
    end
  end

  Hooks.register [:pages, :documents, :posts], :post_render do |doc|
    begin
      processor = ExternalLinkProcessor.new(doc.site)
      processor.process_output(doc)
    rescue => e
      Jekyll.logger.error "external_links:", "failed to process #{doc.path}: #{e.class}: #{e.message}"
    end
  end
end
