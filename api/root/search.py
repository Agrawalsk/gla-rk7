from flask_restful import Resource
from flask import request
from root.db import mdb

class PostSearcher(Resource):
    # Method to handle POST requests
    def post(self):
        # Retrieve the hashtag from the JSON body
        hashtag = request.json.get('hashtag', "")
        print("Hashtags:", hashtag)
        # Use the search_posts method to filter the posts
        filtered_posts = self.search_posts(hashtag)
        return {'posts': filtered_posts}

    # Method to search posts based on hashtags
    def search_posts(self, search_hashtag=""):
        # Convert the search hashtag to lowercase
        search_hashtag = search_hashtag.lower()
        
        # Retrieve all posts from the database
        posts = list(mdb.posts_collection.find())

        # Filter posts based on the search criteria
        filtered_posts = []
        for post in posts:
            # Process the hashtags field
            raw_hashtags = post.get('hashtags', '')
            # Split the hashtag string into an array, trimming any extra whitespace
            hashtags_array = [h.strip() for h in raw_hashtags.split() if h.startswith('#')]
            print("Number of hashtags:", len(hashtags_array))

            # Perform the search with the processed hashtags array
            if not search_hashtag or search_hashtag in [h.lower() for h in hashtags_array]:
                # Add the post to the filtered list if it matches the criteria
                filtered_posts.append({
                    'file_id': str(post['file_id']),
                    'caption': post.get('caption', ''),
                    'hashtags': hashtags_array,
                })

        return filtered_posts
