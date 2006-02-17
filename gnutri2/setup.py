from setuptools import setup, find_packages
from turbogears.finddata import find_package_data

setup(
    name="gnutri2",
    version="1.0",
    #description="",
    #author="",
    #author_email="",
    #url="",
    install_requires = ["TurboGears >= 0.8.9"],
    scripts = ["gnutri2-start.py"],
    zip_safe=False,
    packages=find_packages(),
    package_data = find_package_data(where='gnutri2',
                                     package='gnutri2'),
    )
    