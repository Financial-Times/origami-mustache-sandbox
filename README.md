I'm working on creating a grunt task which will preprocess templates that reference origami templates. 

1. Product using an origami template
1. Product using an origami template that contains partials from the same module
1. Product using an origami template that contains other origami templates
1. Product using an origami template that contains other bower templates
1. Product using an origami template that can have arbitrary html content injected into a region, and this content may take the form of a partial
1. Product using an origami template that can have arbitrary content injected into a region, and this content may take the form of a list of partials 
1. Product using an origami template more than once with different content for each
1. Product using an origami template which itself carries out some of the actions above (e.g. a o-ft-full-header module which consumes o-ft-header but with signin, search, nav all pre-injected)
1. Product consumes its own partial, which in turn carries out some of the above actions

allow importing of html