
import { createRequest } from "./create-request"
import { parseSuggestions } from "./parse/suggestions"


export async function suggestion(input: string) {
  try {
    if (!input) {
      return []
    }

    const response = await createRequest('music/get_search_suggestions', {input})

    return parseSuggestions(response.data)
  } catch (e) {
    console.error(e)
    console.log(e.response)

    return []
  }
}
