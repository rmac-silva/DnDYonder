import requests
from bs4 import BeautifulSoup
import pprint as pp


class WikidotScraper:

    def __init__(self):

        self.index = 0
        self.fails = 0
        self.results = {}

    def fetch_class_features(self, class_name):
        url = f"https://dnd5e.wikidot.com/{class_name}"
        # print("Fetching Wikidot info for class:", class_name, " URL:", url)
        resp = requests.get(url)

        # If response is invalid, return empty results
        if resp.status_code != 200:
            self.results = {}
            self.fails = 0
            self.index = 0
            return self

        # print("Response received, parsing HTML...")

        soup = BeautifulSoup(resp.content, "html.parser")
        last_header = None
        append_to_last = False
        while True:

            # Look for index 0
            header = soup.find(id=f"toc{self.index}")

            # If there's a header, create a new list in results to store the text elements
            if header is not None:

                append_to_last = header.name not in ["h1", "h2", "h3"]

                if not append_to_last:
                    self.results[header.text] = []

                # Find the next sibling (next html element)
                body = header.find_next_sibling()

                # If the element is h4,h5,h6,h7 then it belongs to the previous header

                # While the body is not the next header, keep adding to the list
                while body is not None and body.get("id", "no-id") != f"toc{self.index + 1}":
                    # Append previous
                    if append_to_last and last_header is not None:
                        self.results[last_header.text].append(self.format_html_text(str(body), header.text))
                    else:
                        self.results[header.text].append(self.format_html_text(str(body)))

                    # Fetch next one
                    body = body.find_next_sibling()

            else:
                self.fails += 1

            self.index += 1
            if not append_to_last:
                last_header = header

            if self.fails > 3:
                break
        return self

    def format_html_text(self, html_text: str, subtitle: str = ""):
        # Use BeautifulSoup to parse the HTML text
        if (html_text is None) or (html_text.strip() == ""):
            return ""

        if html_text.strip().startswith("<table"):

            # Split each table into different rows, where each row starts with <tr> and ends with </tr>
            soup = BeautifulSoup(html_text, "html.parser")
            rows = soup.find_all("tr")
            rows_formatted = []
            for row in rows:

                # Remove all HTML tags from the row
                row_text = row.get_text(separator=" ").strip()

                row_text_rows = row_text.split("\n")

                if len(row_text_rows) == 1:
                    rows_formatted.append(row_text)
                else:
                    rows_formatted.append(row_text_rows)

            return {"content": rows_formatted, "table": True, "subtitle":""}
        else:
            soup = BeautifulSoup(html_text, "html.parser")

            # Extract and return the text content
            if subtitle != "":
                return {"content": soup.get_text(separator=" ", strip=True), "table": False, "subtitle": subtitle}
            else:
                return {"content": soup.get_text(separator=" ", strip=True), "table": False, "subtitle": ""}

    def print_results(self):
        # Convert the dictionary entries into an array of key-value pairs
        results_array = [{"key": key, "value": value} for key, value in self.results.items()]
        pp.pprint(results_array)

    def fetch_results(self):
        self.index = 0
        self.fails = 0
        formatted_results = self.format_results()
        self.results = {}
        return formatted_results

    def fetch_level_required(self, content: str):
        """Search for strings like 1st or 5th or 29th in the content and return as an integer."""
        import re

        match = re.search(r'(\d+)(st|nd|rd|th)(?: level|-level)', content)
        if match:
            return int(match.group(1))
        else:
            return 0

    def format_results(self):
        formatted_res = {}

        seen_subtitles = set()
        
        for key, value in self.results.items():
            merged_content = {}
            merged_content["title"] = key
            merged_content["level_required"] = self.fetch_level_required(value[0]["content"])
            merged_content["content"] = []
            
            for item in value:
                try:
                    if item["table"]:
                        merged_content["table"] = {}
                        print("Table item:",item,"\n\n")
                        merged_content["table"]= {"table_header" : item["content"][0], "table_rows": item["content"][1:]}
                        formatted_res[key] = merged_content
                    elif item["subtitle"] != "" and not item["table"] and item["subtitle"] not in seen_subtitles:
                        seen_subtitles.add(item["subtitle"])
                        merged_content["content"].append(f"\n{item['subtitle']}\n{item['content']}")
                        formatted_res[key] = merged_content
                    elif not item["table"] and item["subtitle"] == "":
                        merged_content["content"].append(item["content"])
                        formatted_res[key] = merged_content
                except:
                    # print(f"Error processing item in format_results: {e} || value: {value} || item: {item}\n\n")
                    pass
            
            merged_content["content"] = "\n".join(merged_content["content"])

        return formatted_res

    def dump_json(self, filepath: str):
        import json

        with open(filepath, "w", encoding="utf-8") as f:

            # results_array = [{"key": key, "value": value} for key, value in self.results.items()]
            # json.dump(results_array, f, ensure_ascii=False, indent=4)

            json.dump(self.format_results(), f, ensure_ascii=False, indent=4)


WikidotScraper().fetch_class_features("ranger").dump_json("./temp.json")
