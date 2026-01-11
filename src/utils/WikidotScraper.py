import json
import requests
from bs4 import BeautifulSoup
import pprint as pp

WORDS = {
    "zero": 0,
    "one": 1,
    "two": 2,
    "three": 3,
    "four": 4,
    "five": 5,
    "six": 6,
    "seven": 7,
    "eight": 8,
    "nine": 9,
    "ten": 10,
}

class WikidotScraper:

    def __init__(self):

        self.index = 0
        self.fails = 0
        self.results = {}

    def fetch_class_features(self, class_name):
        url = f"https://dnd5e.wikidot.com/{class_name}"
        return self.execute_request_wikidot(url)

    def fetch_subclass_features(self, subclass_name, class_name):
        subclass_name_formatted = subclass_name.replace(" ", "-").lower()
        url = f"https://dnd5e.wikidot.com/{class_name}:{subclass_name_formatted}"
        return self.execute_request_wikidot(url)

    def fetch_item_info(self, item_name):
        item_name_formatted = item_name.replace("_", "-").lower()
        item_name_formatted = item_name_formatted.replace("'", "") #Remove any apostrophes
        url = f"http://dndroll.wikidot.com/items:{item_name_formatted}"
        return self.execute_request_dndroll_item_wikidot(url)
    
    def fetch_spell_info(self, spell_name):
        spell_name_formatted = spell_name.replace("_", "-").lower()
        spell_name_formatted = spell_name_formatted.replace("'", "") #Remove any apostrophes
        url = f"http://dndroll.wikidot.com/spells:{spell_name_formatted}"
        print("Fetching spell info from URL:", url)
        return self.execute_request_dndroll_spell_wikidot(url)

    # region - Wikidot Request Execution and Parsing
    def execute_request_wikidot(self, url: str):
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

    def get_table_columns(self, table_html: str):
        soup = BeautifulSoup(table_html, "html.parser")
        rows = soup.find_all("tr")
        column_counts = []

        for row in rows:
            th_tags = row.find_all("th")
            column_counts.append(len(th_tags))

        # Return the maximum number of columns found in any row
        return max(column_counts) if column_counts else 0

    def format_html_text(self, html_text: str, subtitle: str = ""):
        # Use BeautifulSoup to parse the HTML text
        if (html_text is None) or (html_text.strip() == ""):
            # Always return a dict shape so callers can rely on .get("content") etc.
            return {"content": "", "table": False, "subtitle": subtitle or ""}

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

            return {"content": rows_formatted, "table": True, "subtitle": "", "num_columns": self.get_table_columns(html_text)}
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

    def fetch_results_raw(self):
        self.index = 0
        self.fails = 0
        temp_results = self.results
        self.results = {}
        return temp_results
    
    def fetch_level_required(self, content: str):
        """Search for strings like 1st or 5th or 29th in the content and return as an integer."""
        import re

        try:
            match = re.search(r"(\d+)(st|nd|rd|th)(?: level|-level)", content)
            if match:
                return int(match.group(1))
            else:
                return 0
        except:
            return 0

    def fetch_misc_class_info(self, content : str):
        """Fetches misc class info like hit die, primary ability, saving throws etc... from the content string.
        
        Expected content:
            Hit Points
            Hit Dice: 1d10 per ranger level Hit Points at 1st Level: 10 + your Constitution modifier Hit Points at Higher Levels: 1d10 (or 6) + your Constitution modifier per ranger level after 1st
            Proficiencies
            Armor: Light armor, medium armor, shields Weapons: Simple weapons, martial weapons Tools: None Saving Throws: Strength, Dexterity Skills: Choose three from Animal Handling, Athletics, Insight, Investigation, Nature, Perception, Stealth, and Survival
            Equipment
            You start with the following equipment, in addition to the equipment granted by your background:
        """
        import re

        misc_info = {}

        try:
            
            hit_die_match = re.search(r"Hit Dice:\s\S\S\S(?:\S|.)", content)
            if hit_die_match:
                misc_info["hit_die"] = int(hit_die_match.group().split("Hit Dice:")[1].strip().split("d")[1])
        except:
            pass

        try:
            saving_throws_match = re.search(r"Saving Throws:.*Skills", content)
            if saving_throws_match:
                saving_throws = saving_throws_match.group().split("Saving Throws:")[1].split("Skills")[0].strip()
                
                misc_info["saving_throws"] = saving_throws.split(",")
        except:
            pass

        try:
            skills = re.search(r"Choose\s(\w*\S)\sfrom(.*)", content)
            if skills:
                # Remove the word "and" from the skills list
                skills_list_cleaned = skills.group(2).replace(" and ", "")
                misc_info["skills_list"] = skills_list_cleaned.split(",")
                misc_info["num_skills_to_choose"] = WORDS[str(skills.group(1)).strip()]
        except:
            pass
        
        try:
            valid_profs = ["Light Armor", "Medium Armor", "Heavy Armor", "Shields", ]
            armor_proficiencies_match = re.search(r"Armor:(.*)Weapons", content)
            if armor_proficiencies_match:
                #Turn into list and capitalize each word, so "light armor, medium armor, shields" becomes ["Light Armor", "Medium Armor", "Shields"]
                
                misc_info["armor_proficiencies"] = []
                
                for armor in armor_proficiencies_match.group(1).split(","):
                    name = armor.strip().title()
                    if name in valid_profs:
                        misc_info["armor_proficiencies"].append(name)
                    elif name.startswith("Shield"):
                        misc_info["armor_proficiencies"].append("Shields")
                    elif name.lower().strip() == "all armor":
                        misc_info["armor_proficiencies"].extend(valid_profs[:3]) #All armor means light, medium and heavy
                        
                        
        except:
            pass
        
        try:
            baseline_profs = ["Simple Weapons", "Martial Weapons"]
            weapon_proficiencies_match = re.search(r"Weapons:(.*)Tools", content)
            if weapon_proficiencies_match:
                misc_info["weapon_proficiencies"] = []
                # Remove the s at the end, so Daggers becomes Dagger
                for weapon in weapon_proficiencies_match.group(1).split(","):
                    name = weapon.strip().title()    
                    
                    if(name not in baseline_profs and name.endswith("s")):
                        misc_info["weapon_proficiencies"].append(name[:-1])
                    else:
                        misc_info["weapon_proficiencies"].append(name)
                    
                
        except:
            pass
        
        try:
            tool_proficiencies_match = re.search(r"Tools:(.*)Saving Throws", content)
            if tool_proficiencies_match:
                #Ignore "None"
                if tool_proficiencies_match.group(1).strip().lower() == "none":
                    misc_info["tool_proficiencies"] = []
                else:
                    misc_info["tool_proficiencies"] = [ap.strip().title() for ap in tool_proficiencies_match.group(1).split(",")]
        except:
            pass
        
        
        
        return misc_info
    
    def format_results(self):
        formatted_res = {}
        seen_subtitles = set()
        for key, value in self.results.items():
            
            merged_content = {}
            merged_content["title"] = key
            try:
                merged_content["level_required"] = self.fetch_level_required(value[0]["content"])
            except: 
                merged_content["level_required"] = 0
            merged_content["content"] = []
            merged_content["tables"] = []

            for item in value:
                try:
                    if item["table"]:
                        
                        merged_content["tables"].append({"table_header": item["content"][0], "table_rows": item["content"][1:], "num_columns": item["num_columns"]})
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

        
        if("Class Features" not in formatted_res):
            with open("results.json", "w", encoding="utf-8") as f:
                # results_array = [{"key": key, "value": value} for key, value in self.results.items()]
                # json.dump(results_array, f, ensure_ascii=False, indent=4)
                json.dump(formatted_res, f, ensure_ascii=False, indent=4)
            return formatted_res 
        else: #The classes have a special field named "Class Features" where we parse hit dice, proficiencies etc...
            class_info = "\n".join(formatted_res["Class Features"]["content"].split("\n\n")[1:])
            misc_info = self.fetch_misc_class_info(class_info)
            
            formatted_res["misc_class_info"] = {'title': 'Class Features', 'content': misc_info, 'level_required': 0, 'tables': []}
            return formatted_res
        
        

    def dump_json(self, filepath: str):
        import json

        with open(filepath, "w", encoding="utf-8") as f:

            # results_array = [{"key": key, "value": value} for key, value in self.results.items()]
            # json.dump(results_array, f, ensure_ascii=False, indent=4)

            json.dump(self.results, f, ensure_ascii=False, indent=4)

    # endregion

    # region - dndroll.wikidot Items, Execution and Parsing

    def execute_request_dndroll_item_wikidot(self, url: str):
        resp = requests.get(url)

        if resp.status_code != 200:
            self.results = {}
            self.fails = 0
            self.index = 0
            # Throw an exception indicating that the item was not found
            raise Exception(f"Item not found on {url}. If you believe this is an error, try heading to the URL in your browser.")
            

        soup = BeautifulSoup(resp.content, "html.parser")
        
        # Fetch the element with class wiki-content-table
        page_content = soup.find(id="page-content")

        if(page_content is None):
            self.results = {}
            return self
        
        #Search for an element with the ID 404-message
        error_message = page_content.find(id="404-message")
        if(error_message is not None):
            self.results = {}
            return self
        
        #Find all the paragraph elements inside the content. If there's 2 paragraph contents
        # The first one is the description and the second paragraph element is just the source (useless)
        # So we only fetch the first paragraph element, and search for a table.
        
        #If there's three paragraphs, the second one is content as well.
        paragraph_elements = page_content.find_all("p")
        has_table = page_content.find("table")
        
        if(has_table):
            
            self.results["Description"] = paragraph_elements[0].text.strip()
        
            table_rows = page_content.find_all("tr")
            if(table_rows is None):
                return self
            
            header_cols = []
            table_content = []
            for row in table_rows:
                entries = row.find_all("th")
                
                for entry in entries:
                    header_cols.append(entry.text.strip())
                    
                entries = row.find_all("td")
                
                for entry in entries:
                    table_content.append(entry.text.strip())
            
            if(len(header_cols) != len(table_content)):
                return self
            else:
                for i in range(0, len(header_cols)):
                    self.results[header_cols[i]] = table_content[i]
        elif(not has_table):
            
            
            self.results["Description"] = paragraph_elements[0].text.strip()
        
            self.results["Content"] = paragraph_elements[1].text.strip()
            

        return self

    def format_results_dndroll_items(self):
        formatted_results = {}
        formatted_results["description"] = self.results["Description"]
        formatted_results["features"] = []
        formatted_results["attacks"] = []

        if("Content" in self.results):
            components = self.results["Content"].split("\n")
            for comp in components:
                key_value = comp.split(": ")
                if(len(key_value) == 2):
                    
                    if(key_value[0].strip() == "Cost"):
                        cost_parts = key_value[1].strip().split(" ")
                        amount = cost_parts[0]
                        currency = cost_parts[1]
                        if currency == "gp":
                            formatted_results["cost"] = int(amount)
                        else:
                            formatted_results["cost"] = 1
                            
                    elif(key_value[0].strip() == "Weight"):
                        weight_parts = key_value[1].strip().split(" ")
                        formatted_results["weight"] = int(weight_parts[0])
        else:
            #Process table data
            for key, value in self.results.items():
                if(key == "Name"):
                    #Turn Crossbow, Light into Light Crossbow
                    name_parts = value.split(", ")
                    if len(name_parts) == 2:
                        formatted_results["name"] = f"{name_parts[1]} {name_parts[0]}"
                    else:
                        formatted_results["name"] = value
                
                elif(key == "Weight"):
                    components = value.split(" ")
                    if len(components) == 2:
                        formatted_results["weight"] = float(components[0])
                    else:
                        formatted_results["weight"] = 0.0
                
                elif(key == "Cost"):
                    #Turn 25 gp into 25 and sp or cp into 1gp
                    cost_parts = value.split(" ")
                    
                    if len(cost_parts) == 2:
                        amount = cost_parts[0]
                        currency = cost_parts[1]
                        if currency == "gp":
                            formatted_results["cost"] = int(amount)
                        else:
                            formatted_results["cost"] = 1
                            
                elif(key == "Damage"):
                    components = value.split(" ")
                    if len(components) == 2:
                        formatted_results["attacks"].append({
                            "damage": components[0],
                            "damage_type": [str(components[1]).capitalize()]
                        })  
                        
                        
                elif(key == "Properties"):
                    components = value.split(", ")
                    
                    # Search for the property (Range: XX/YY) and extract the range by removing the parentheses
                    properties = []
                    for prop in components:
                        if prop.startswith("(Range"):
                            range_value = prop.replace("(", "").replace(")", "").strip()
                            range_comps = range_value.split(" ")
                            range_value = f"{range_comps[0]} ({range_comps[1]})"
                            formatted_results["range"] = range_value
                        else:
                            properties.append(prop)
                    formatted_results["properties"] = properties
                    
                elif(key == "Armor Class"):
                    formatted_results["armor_class"] = int(value)
                    
                elif(key == "Stealth"):
                    if(value.lower() == "disadvantage"):
                        formatted_results["stealth_disadvantage"] = True
                    else:
                        formatted_results["stealth_disadvantage"] = False
                
                elif(key == "Strength"):
                    try:
                        formatted_results["strength_requirement"] = int(value)
                    except:
                        formatted_results["strength_requirement"] = 0
                
                else:
                    pass
        
        if("range" not in formatted_results):
            formatted_results["range"] = "Melee"
        
        return formatted_results
    # endregion
    
    #region - dndroll.wikidot Spells 
    def execute_request_dndroll_spell_wikidot(self, url: str):
        resp = requests.get(url)

        if resp.status_code != 200:
            #print("Failed to fetch spell data, status code:", resp.status_code)
            self.results = {}
            self.fails = 0
            self.index = 0
            raise Exception(f"Item not found on {url}. If you believe this is an error, try heading to the URL in your browser.")

        soup = BeautifulSoup(resp.content, "html.parser")
        
        # Fetch the element with class wiki-content-table
        page_content = soup.find(id="page-content")

        if(page_content is None):
            print("No page content")
            self.results = {}
            raise Exception(f"Page ({url}) has no content to scrape. If you believe this is an error, try heading to the URL in your browser.")
        
        #Search for an element with the ID 404-message
        error_message = page_content.find(id="404-message")
        if(error_message is not None):
            #print("Error message found in spell fetch")
            self.results = {}
            raise Exception(f"Page ({url}) has no content to scrape (404). If you believe this is an error, try heading to the URL in your browser.")

        
        try:
            #Find all the paragraph elements inside the content. If there's 2 paragraph contents
            # The first one is the description and the second paragraph element is just the source (useless)
            # So we only fetch the first paragraph element, and search for a table.
            
            #If there's three paragraphs, the second one is content as well.
            paragraph_elements = page_content.find_all("p")

            #First paragraph is spell information, range, casting time, components etc...
            self.results["Content"] = paragraph_elements[0].text.strip()
            
            # Iterate the following paragraphs, until you reach the one that starts with "Spell Lists.  "
            #print(f"Iterating through {len(paragraph_elements)} paragraph elements for description.")
            for i in range(1, len(paragraph_elements)):
                para_text = paragraph_elements[i].text.strip()
                if para_text.startswith("Spell Lists."):
                    break
                else:
                    if "Description" not in self.results:
                        self.results["Description"] = para_text
                    else:
                        self.results["Description"] += "\n\n" + para_text
                
            
            
            return self
        except Exception as e:
            raise Exception(f"Error parsing spell data from {url}: {str(e)}")
    
    def format_results_dndroll_spells(self):
        try:
            formatted_results = {}
            formatted_results["description"] = self.results.get("Description", "")

            level, school, is_ritual = self.fetch_school_and_level_from_paragraphs()
            formatted_results["level"] = level
            formatted_results["school"] = school
            formatted_results["is_ritual"] = is_ritual
            
            if("Content" in self.results):
                
                components = self.results["Content"].split("\n")
                print("Spell components:", components)
                for comp in components:
                    key_value = comp.split(": ")
                    if(len(key_value) == 2):
                        key = key_value[0].strip()
                        value = key_value[1].strip()
                        
                        if key.lower() == "casting time":
                            formatted_results["casting_time"] = value
                        elif key.lower() == "range":
                            formatted_results["range"] = value
                        elif key.lower() == "components":
                            formatted_results["components"] = value
                        elif key.lower() == "duration":
                            formatted_results["duration"] = value
                        else:
                            formatted_results["spell_details"][key.lower().replace(" ", "_")] = value

            self.results = {}
            self.fails = 0
            self.index = 0
            return formatted_results
        except Exception as e:
            raise Exception(f"Error formatting spell results: {str(e)}")
    
    def fetch_school_and_level_from_paragraphs(self):
        import re
        is_ritual = True if "(ritual)" in self.results["Content"].lower() else False
        # Information can be 3rd-level evocation or 1st-level abjuration or conjuration cantrip. It can also have the word ritual at the end
        info_match = re.search(r"(\d+)(st|nd|rd|th)-level (\w+)|(\w+) cantrip", self.results["Content"].split("\n")[0])
        if info_match:
            if info_match.group(4):  # Cantrip case
                return(0,info_match.group(4).lower(), is_ritual)
            else:
                return(int(info_match.group(1)), info_match.group(3).lower(), is_ritual)

        return (-1,"", is_ritual)
    #endregion


