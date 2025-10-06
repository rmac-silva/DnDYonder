from fastapi import FastAPI

app = FastAPI()


@app.get("/")
def read_root():
    return {"Hello": "World"}

@app.get("/home")
def homepage():
    return {"Hello": "World"}


# @app.get("/items/{item_id}") # Example endpoint with path parameter and optional query parameter
# def read_item(item_id: int, q: Union[str, None] = None):
#     return {"item_id": item_id, "q": q}