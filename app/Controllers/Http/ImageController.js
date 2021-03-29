'use strict'

const Helpers = use('Helpers')
const Image = use('App/Models/Image')
const Property = use('App/Models/Property')

/**
 * Resourceful controller for interacting with images
 */
class ImageController {
  /**
   * Create/save a new image.
   * POST images
   */
  async store ({ params, request }) {
    const property = await Property.findOrFail(params.id)

    const images = request.file('image', {
      types: ['image'],
      size: '2mb'
    })

    await images.moveAll(Helpers.tmpPath('uploads'), file => ({
      name: `${Date.now()}-${file.clientName}`
    }))

    if (!images.movedAll()) {
      return images.errors()
    }

    await Promise.all(
      images
        .movedList()
        .map(image => property.images().create({ path: image.fileName }))
    )
  }
}

module.exports = ImageController
