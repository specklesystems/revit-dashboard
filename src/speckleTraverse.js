// Will traverse the entire obect and return a flat list of matched speckle objects.
// You can also specify a list of keys to be ignored.

import {getStreamObject} from "@/speckleUtils";

export async function traverseAndMatch(streamId, speckleObj, matchFunction, ignoredKeys, cache = {}) {
  // Determines which keys to ignore when traversing the object keys
  var result = {}
  ignoredKeys = ["@Project Information", "parameters", "data", "@displayMesh", "@displayValue", "displayMesh", "displayValue", "renderMaterial"]
  function shouldIgnore(key) {
    return key.startsWith("__")
      || key == "id"
      || key == "speckle_type"
      || key == "totalChildrenCount"
      || key == "type"
      || ignoredKeys.indexOf(key) != -1
  }

  // Traverse all objects in an array individually
  if (Array.isArray(speckleObj)) {
    console.log("its an array!")
    for (let i = 0; i < speckleObj.length; i++) {
      const obj = speckleObj[i];
      if (!obj.speckle_type) return
      var res = await traverseAndMatch(streamId, obj, matchFunction, ignoredKeys, cache)
      result = {...result, ...res}
    }
    return result
  }

  // Fast exit if the object is not a speckle object.
  if (!speckleObj.speckle_type) {
    return result;
  }

  console.log("traverse obj ", speckleObj)
  var temp = speckleObj
  // Handle speckle reference objects, overrite 'temp' with fetched object
  if (speckleObj.speckle_type === "reference") {
    if (cache[speckleObj.referencedId]) {
      // Check if object has been fetched before
      temp = cache[speckleObj.referencedId]
    } else {
      // Fetch object from server and cache result
      temp = await getStreamObject(streamId, speckleObj.referencedId)
      cache[speckleObj.referencedId] = temp
      console.log("cached " + speckleObj.referencedId, temp)
    }
  }

  // Check if the object matches
  if (matchFunction(temp)) {
    // YES! Add to result
    console.log("it's a match!!", temp)
    result[temp.elementId] = temp;
  } else {
    //Not a match: Traverse the object keys
    const keys = Object.keys(temp);
    for (let i = 0; i < keys.length; i++) {
      const key = keys[i];
      if (shouldIgnore(key)) continue;
      var value = await traverseAndMatch(streamId, temp[key], matchFunction, ignoredKeys, cache);
      // If anything was found, merge results
      result = {...result, ...value}
    }
  }
  // Finally, whatever the result object is, return it
  return result
}