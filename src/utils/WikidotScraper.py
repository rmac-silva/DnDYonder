import requests
from bs4 import BeautifulSoup
import pprint as pp

class WikidotScraper():
    
    def __init__(self,url):
        self.url = url
        self.resp = requests.get(url)
        self.soup = BeautifulSoup(self.resp.content, 'html.parser')
        self.index = 0
        self.fails = 0
        self.results = {} 
        self.fetch_class_features()  


    def fetch_class_features(self):
        while True:
            print("Looking for", f"toc{self.index}")

        # Look for index 0
            header = self.soup.find(id=f"toc{self.index}")

        # If there's a header, create a new list in results to store the text elements
            if header is not None:
                print("[HEADER] Found:", header.text)
                self.results[f"toc{self.index}"] = []

            # Find the next sibling (next html element)
                body = header.find_next_sibling()

            # While the body is not the next header, keep adding to the list
                while body is not None and body.get("id", "no-id") != f"toc{self.index + 1}":
                # Append previous
                    self.results[f"toc{self.index}"].append(str(body))

                # Fetch next one
                    body = body.find_next_sibling()

            else:
                self.fails += 1

            self.index += 1

            if self.fails > 10:
                print("No more headers found, stopping...")
                break

    def print_results(self):
        for key, value in self.results.items():
            print(f"\n\nKEY: {key}\n")
            pp.pprint(value)
            print("\n\n")
